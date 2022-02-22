import { Guid } from 'js-guid'
import {
  doc,
  collection,
  query,
  where,
  limit,
  startAfter,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'
import { requiredConfigEntries } from 'services/useConfig'
import { getFirestore } from 'services/firebase'
import { defineActions } from '.'
// Types
import type { Mapper } from '@automapper/core'
import type { UnwrapRef } from 'vue'
import type {
  DocumentReference,
  CollectionReference,
  Query
} from 'firebase/firestore'
import type {
  RealtimeDocIndex,
  DocWithId,
  DocVmWithId,
  LoadDocsPageActionPayload,
  ReleaseDocsActionPayload,
  LoadRealtimeDocActionPayload,
  LoadRealtimeDocActionResult,
  ReleaseRealtimeDocActionPayload,
  CreateDocActionPayload,
  UpdateDocActionPayload,
  DeleteDocActionPayload
} from '.'
import type { DocStateInterface } from './state'

function buildActions<T extends DocWithId, TVm extends DocVmWithId, TAm> (
  collectionPath: string,
  mapper: Mapper,
  modelName: string,
  viewModelName: string,
  apiModelName: string
) {
  const { releaseDocsTimeout } = requiredConfigEntries('releaseDocsTimeout')

  let releaseDocsTimeoutId: ReturnType<typeof setTimeout> | null = null

  return defineActions({
    __flag: (model: T, viewModel: TVm, apiModel: TAm) => ({ model, viewModel, apiModel }),

    async loadDocsPage (
      {
        page,
        queryConstraints,
        done,
        outOfRange,
        error
      }: LoadDocsPageActionPayload
    ) {
      if (releaseDocsTimeoutId) {
        clearTimeout(releaseDocsTimeoutId)
        releaseDocsTimeoutId = null
      }

      const listLength = (page + 1) * this.docsPageSize
      if (this.docs.length >= listLength) {
        done()
        return
      }

      const db = getFirestore()
      const collectionRef = collection(db, collectionPath) as CollectionReference<TAm>
      const q = query(
        collectionRef,
        ...queryConstraints,
        limit(this.docsPageSize))

      do {
        try {
          let isOutOfRange = false
          let isEmpty = false

          await loadDocsNextPage(
            this.$state,
            q,
            // outOfRange
            () => {
              if (page > 0) {
                isOutOfRange = true
                outOfRange && outOfRange()
              } else {
                isEmpty = true
              }
            })

          if (isOutOfRange) {
            return
          }

          if (isEmpty) {
            break
          }
        } catch (err) {
          error && error(err as Error)
          return
        }

        if (
          this.docs.length < listLength &&
          this.docs.length > page * this.docsPageSize
        ) {
          // Can be the last page. If no more doc found, outOfRange wouldn't fire.
          try {
            await loadDocsNextPage(
              this.$state,
              q,
              // outOfRange
              () => undefined)
          } catch (err) {
            error && error(err as Error)
          }

          break
        }
      } while (this.docs.length < listLength)

      done()
    },

    releaseDocs ({ immediately }: ReleaseDocsActionPayload) {
      if (immediately) {
        this.docs = []
      } else {
        releaseDocsTimeoutId = setTimeout(() => {
          this.docs = []
        }, releaseDocsTimeout)
      }
    },

    loadRealtimeDoc (
      {
        findKey,
        findKeyField,
        done,
        notFound,
        deleted,
        error
      }: LoadRealtimeDocActionPayload
    ) {
      const docKey = Guid.newGuid().toString()

      const release = () => {
        if (this.realtimeDocs[docKey]) {
          this.realtimeDocs[docKey].unsubscribe()
          delete this.realtimeDocs[docKey]
        }
      }

      const result: LoadRealtimeDocActionResult = {
        docKey,
        release
      }

      const db = getFirestore()

      let id: string

      if (findKeyField) {
        const collectionRef = collection(db, collectionPath) as CollectionReference<TAm>
        const q = query(collectionRef, where(findKeyField, '==', findKey))
        getDocs(q)
          .then(querySnapshot => {
            if (querySnapshot.docs.length === 0) {
              notFound && notFound()
            } else if (querySnapshot.docs.length > 1) {
              throw new Error(`[mnapp-firebase-firestore] '${findKey}' is not unique for '${findKeyField}' in '${collectionPath}'`)
            } else {
              id = querySnapshot.docs[0].id
              loadDocById(
                id,
                docKey,
                this.realtimeDocs,
                done,
                notFound,
                deleted,
                error
              )
            }
          })
          .catch((err: Error) => { error && error(err) })
      } else {
        id = findKey
        loadDocById(
          id,
          docKey,
          this.realtimeDocs,
          done,
          notFound,
          deleted,
          error
        )
      }

      return result
    },

    releaseRealtimeDoc ({ docKey }: ReleaseRealtimeDocActionPayload) {
      this.realtimeDocs[docKey].unsubscribe()
      delete this.realtimeDocs[docKey]
    },

    async createDoc ({ doc: docVm }: CreateDocActionPayload<TVm>) {
      const docAm = mapper.map<TVm, TAm>(
        docVm, apiModelName, viewModelName
      )
      const db = getFirestore()
      const docRef = await addDoc(collection(db, collectionPath), docAm) as DocumentReference<TAm>

      docVm.id = docRef.id

      return docVm
    },

    async updateDoc ({ docKey, doc: docVm }: UpdateDocActionPayload<TVm>) {
      const id =
        this.realtimeDocs[docKey]?.doc?.id ||
        (() => { throw new Error(`[mnapp-firebase-firestore] Realtime doc '${docKey}' not available.`) })()

      const docAm = mapper.map<TVm, TAm>(
        docVm, apiModelName, viewModelName
      )

      const db = getFirestore()
      const docRef = doc(db, collectionPath, id)
      await updateDoc(docRef, docAm)

      this.releaseDocs({ immediately: true })

      return new Promise<void>(resolve => resolve())
    },

    async deleteDoc ({ docKey }: DeleteDocActionPayload) {
      const id =
        this.realtimeDocs[docKey]?.doc?.id ||
        (() => { throw new Error(`[mnapp-firebase-firestore] Realtime doc '${docKey}' not available.`) })()

      const db = getFirestore()
      const docRef = doc(db, collectionPath, id)
      await deleteDoc(docRef)
    }
  })

  async function loadDocsNextPage (
    state: UnwrapRef<DocStateInterface<T>>,
    q: Query<TAm>,
    outOfRange: () => void
  ) {
    if (state.docs.length > 0) {
      const lastDoc = state.docs[state.docs.length - 1]
      const lastDocRef = doc(q.firestore, collectionPath, lastDoc.id)
      q = query(q, startAfter(await getDoc(lastDocRef)))
    }

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      outOfRange()
    } else {
      const docAndIds = querySnapshot.docs.map(docSnapshot => {
        return [docSnapshot.data(), docSnapshot.id]
      })
      const docs = docAndIds.map(docAndId => docAndId[0] as TAm)
      const docIdMap = new Map(docAndIds as Iterable<readonly [TAm, string]>)

      state.docs = state.docs.concat(
        mapper.mapArray<TAm, T>(
          docs, modelName, apiModelName,
          { extraArguments: { idMap: docIdMap } }
        ) as UnwrapRef<T[]>
      )
    }
  }

  function loadDocById (
    id: string,
    docKey: string,
    realtimeDocs: RealtimeDocIndex<UnwrapRef<T>>,
    done: () => void,
    notFound?: (() => void),
    deleted?: (() => void),
    error?: ((error: Error) => void)
  ) {
    const db = getFirestore()
    const docRef = doc(db, collectionPath, id) as DocumentReference<TAm>
    const unsubscribe = onSnapshot(
      docRef,
      // onNext
      docSnapshot => {
        const data = docSnapshot.data()

        if (data) {
          const docM = mapper.map<TAm, T>(
            data, modelName, apiModelName,
            { extraArguments: { idMap: new Map([[data, docSnapshot.id]]) } }
          )
          realtimeDocs[docKey].doc = docM as UnwrapRef<T>

          done()
        } else {
          if (realtimeDocs[docKey].doc) {
            deleted && deleted()
          } else {
            notFound && notFound()
          }

          realtimeDocs[docKey].unsubscribe()
          delete realtimeDocs[docKey]
        }
      },
      // onError
      err => {
        error && error(err)
      }
    )

    realtimeDocs[docKey] = {
      unsubscribe
    }
  }
}

export default buildActions
