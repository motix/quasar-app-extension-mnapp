import { Mapper } from '@automapper/core'
import { Guid } from 'js-guid'
import { findIndex } from 'lodash'

import { UnwrapRef } from 'vue'

import {
  addDoc, collection, CollectionReference, deleteDoc, doc, DocumentReference, getDoc, getDocs,
  limit, onSnapshot, query, Query, runTransaction, startAfter, UpdateData, updateDoc, where
} from 'firebase/firestore'

import { urlFriendlyNormalizeString } from 'utils/normalization'

import { getFirestore } from 'services/firebase'

import { requiredConfigEntries } from 'composables/useConfig'

import {
  CreateDocActionPayload, defineActions, DeleteDocActionPayload, DocModel,
  LoadDocsPageActionPayload, LoadRealtimeDocActionPayload, LoadRealtimeDocActionResult, MapOptions,
  RealtimeDocIndex, ReleaseDocsActionPayload, ReleaseRealtimeDocActionPayload,
  UpdateDocActionPayload
} from './'
import { DocStateInterface } from './state'

function buildActions<T extends DocModel, TVm, TAm> (
  collectionPath: string,
  mapper: Mapper,
  modelName: string,
  viewModelName: string,
  apiModelName: string,
  mapOptions: MapOptions<T, TAm> | undefined
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
        limit(this.docsPageSize)
      )

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
            }
          )

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
                (id) => this.onDocUpdate(id),
                (id) => this.onDocDelete(id),
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
          (id) => this.onDocUpdate(id),
          (id) => this.onDocDelete(id),
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

    async createDoc ({ doc: docVm, idField }: CreateDocActionPayload<TVm>) {
      const docAm = mapper.map<TVm, TAm>(
        docVm, apiModelName, viewModelName
      )

      const db = getFirestore()
      const collectionRef = collection(db, collectionPath) as CollectionReference<TAm>
      let docRef: DocumentReference<TAm>

      if (idField) {
        const id = urlFriendlyNormalizeString(String(docVm[idField])) as string
        docRef = doc(collectionRef, id)
        await runTransaction(db, async transaction => {
          const existingDocSnapshot = await transaction.get(docRef)

          if (existingDocSnapshot.exists()) {
            throw new Error(`[mnapp-firebase-firestore] Failed to generate id from '${String(idField)}' field. '${docRef.path}' already exists.`)
          }

          transaction.set(docRef, docAm)
        })
      } else {
        docRef = await addDoc(collectionRef, docAm)
      }

      const newDocM = await this.onDocCreate(docRef.id)
      const newDocVm = mapper.map<T, TVm>(newDocM, viewModelName, modelName)

      return newDocVm
    },

    async updateDoc ({ docKey, doc: docMOrVm, isViewModel }: UpdateDocActionPayload<T | TVm>) {
      const id =
        this.realtimeDocs[docKey]?.doc?.id ||
        (() => { throw new Error(`[mnapp-firebase-firestore] Realtime doc '${docKey}' not available.`) })()

      let docAm: TAm

      if (isViewModel) {
        docAm = mapper.map<TVm, TAm>(
          docMOrVm as TVm, apiModelName, viewModelName
        )
      } else {
        docAm = mapper.map<T, TAm>(
          docMOrVm as T, apiModelName, modelName
        )
      }

      const db = getFirestore()
      const docRef = doc(db, collectionPath, id) as DocumentReference<TAm>
      await updateDoc(docRef, docAm as UpdateData<TAm>)
      await this.onDocUpdate(id)
    },

    async deleteDoc ({ docKey }: DeleteDocActionPayload) {
      const id =
        this.realtimeDocs[docKey]?.doc?.id ||
        (() => { throw new Error(`[mnapp-firebase-firestore] Realtime doc '${docKey}' not available.`) })()

      const db = getFirestore()
      const docRef = doc(db, collectionPath, id)
      await deleteDoc(docRef)
      this.onDocDelete(id)
    },

    async onDocCreate (id: string) {
      const db = getFirestore()
      const docRef = doc(db, collectionPath, id) as DocumentReference<TAm>

      this.releaseDocs({ immediately: true })

      const newDocAm = (await getDoc(docRef)).data()

      !newDocAm && (() => { throw new Error(`[mnapp-firebase-firestore] Failed to retrieve created doc '${collectionPath}/${docRef.id}'.`) })()

      const idMap = new Map([[newDocAm, docRef.id]])
      const extraArguments = { idMap }
      const newDocM = mapper.map<TAm, T, typeof extraArguments>(
        newDocAm, modelName, apiModelName, { extraArguments }
      )

      this.recentlyAddedDocs.push(newDocM as UnwrapRef<DocStateInterface<T>>['recentlyAddedDocs'][number])

      return newDocM
    },

    async onDocUpdate (id: string) {
      const db = getFirestore()
      const docRef = doc(db, collectionPath, id) as DocumentReference<TAm>

      this.releaseDocs({ immediately: true })

      const newDocAm = (await getDoc(docRef)).data()

      !newDocAm && (() => { throw new Error(`[mnapp-firebase-firestore] Failed to retrieve updated doc '${collectionPath}/${docRef.id}'.`) })()

      const idMap = new Map([[newDocAm, id]])
      const extraArguments = { idMap }
      const newDocM = mapper.map<TAm, T, typeof extraArguments>(
        newDocAm, modelName, apiModelName, { extraArguments }
      )

      const addedIndex = findIndex(this.recentlyAddedDocs, ['id', id])

      if (addedIndex > -1) {
        this.recentlyAddedDocs[addedIndex] = newDocM as UnwrapRef<DocStateInterface<T>>['recentlyAddedDocs'][number]
      } else {
        const updatedIndex = findIndex(this.recentlyUpdatedDocs, ['id', id])

        if (updatedIndex > -1) {
          this.recentlyUpdatedDocs[updatedIndex] = newDocM as UnwrapRef<DocStateInterface<T>>['recentlyUpdatedDocs'][number]
        } else {
          this.recentlyUpdatedDocs.push(newDocM as UnwrapRef<DocStateInterface<T>>['recentlyUpdatedDocs'][number])
        }
      }
    },

    onDocDelete (id: string) {
      this.releaseDocs({ immediately: true })

      this.recentlyDeletedDocs.push(id)
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
      const extraArguments = { idMap: docIdMap }

      state.docs = state.docs.concat(
        mapper.mapArray<TAm, T, typeof extraArguments>(
          docs, modelName, apiModelName,
          {
            extraArguments,
            afterMap: mapOptions?.apiModelToModelAfterMap
          }
        ) as UnwrapRef<T[]>
      )
    }
  }

  function loadDocById (
    id: string,
    docKey: string,
    realtimeDocs: RealtimeDocIndex<UnwrapRef<T>>,
    onDocUpdate: (id: string) => Promise<void>,
    onDocDelete: (id: string) => void,
    done: () => void,
    notFound?: (() => void),
    deleted?: (() => void),
    error?: ((error: Error) => void)
  ) {
    const db = getFirestore()
    const docRef = doc(db, collectionPath, id) as DocumentReference<TAm>
    let firstSnapshot = true
    const unsubscribe = onSnapshot(
      docRef,
      // onNext
      docSnapshot => {
        const data = docSnapshot.data()

        if (data) {
          const extraArguments = { idMap: new Map([[data, id]]) }
          const docM = mapper.map<TAm, T, typeof extraArguments>(
            data, modelName, apiModelName, { extraArguments }
          )
          realtimeDocs[docKey].doc = docM as UnwrapRef<T>

          done()

          if (firstSnapshot) {
            firstSnapshot = false
          } else {
            void onDocUpdate(id)
          }
        } else {
          if (realtimeDocs[docKey].doc) {
            deleted && deleted()
            onDocDelete(id)
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
