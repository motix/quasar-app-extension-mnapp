import { Dialog } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import useNotifications from 'composables/useNotifications'
import useReturnUrl from 'composables/useReturnUrl'
// Main
import { ref, computed, nextTick, Ref } from 'vue'
// Types
import type {
  LoadRealtimeDocActionPayload,
  LoadRealtimeDocActionResult,
  UpdateDocActionPayload,
  DeleteDocActionPayload
} from 'services/firebase-firestore'
import type usePageFeatures from './usePageFeatures'
import type usePageStatus from './usePageStatus'

export default function usePageData<T = unknown, TVm = unknown> (
  goBack: ReturnType<typeof useReturnUrl>['goBack'],
  hasEditor: ReturnType<typeof usePageFeatures>['hasEditor'],
  muteNextRealtimeUpdate: ReturnType<typeof usePageStatus>['muteNextRealtimeUpdate'],
  muteViewerWatch: ReturnType<typeof usePageStatus>['muteViewerWatch'],
  isDirty: ReturnType<typeof usePageStatus>['isDirty']
) {
  // Private

  const router = useRouter()
  const route = useRoute()

  const {
    notifyErrorDebug,
    notifyLoadDataError
  } = useNotifications()

  // Data

  const findKey = ref(route.params.findKey as string)
  const modelFindKeyField = ref<keyof T & keyof TVm>('id' as keyof T & keyof TVm) as Ref<keyof T & keyof TVm>
  const docKey = ref<string | null>(null)
  const model = ref(null) as Ref<T | null>
  const viewModel = ref(null) as Ref<TVm | null>

  // Method Refs

  const modelGetter = ref<((docKey: string) => T | null) | null>(null)
  const viewModelGetter = ref<((docKey: string) => TVm | null) | null>(null)
  const releaseModel = ref<(() => void) | null>(null)
  const updateModel = ref<((payload: UpdateDocActionPayload<T | TVm>) => Promise<void>) | null>(null)
  const deleteModel = ref<((payload: DeleteDocActionPayload) => Promise<void>) | null>(null)

  // Computed

  const m = computed(() => model.value || (() => { throw new Error('model not ready') })())
  const vm = computed(() => viewModel.value || (() => { throw new Error('viewModel not ready') })())

  // Methods

  function loadModel (
    loadModel: (payload: LoadRealtimeDocActionPayload) => LoadRealtimeDocActionResult
  ) {
    return new Promise<void>((resolve) => {
      let resolveOnce: typeof resolve | null = resolve

      const payload: LoadRealtimeDocActionPayload = {
        findKey: findKey.value,
        // Asuming view model and API model has this same field
        findKeyField: modelFindKeyField.value === 'id' ? undefined : String(modelFindKeyField.value),
        done: () => {
          if (model.value && !muteNextRealtimeUpdate.value) {
            Dialog.create({
              title: 'Refresh',
              message: 'This page\'s data has changed. Do you want to refresh?',
              cancel: true,
              persistent: true,
              ok: {
                color: 'primary'
              }
            })
              .onOk(() => {
                isDirty.value = false
                getModelAndViewModel()
              })
          } else {
            muteNextRealtimeUpdate.value = false
            getModelAndViewModel()
            resolveOnce && resolveOnce()
            resolveOnce = null
          }
        },
        notFound: () => {
          // TODO: Reserve page
          void router.replace('/Error404')
        },
        deleted: () => {
          !muteNextRealtimeUpdate.value && Dialog.create({
            title: 'Deleted',
            message: 'This page\'s data is deleted. You will be redireted to previous page.',
            persistent: true,
            ok: {
              color: 'primary'
            }
          })
            .onOk(() => {
              goBack()
            })
        },
        error: error => {
          console.error(error)
          notifyLoadDataError()
          notifyErrorDebug(error)
          resolveOnce && resolveOnce()
          resolveOnce = null
        }
      }

      try {
        const result = loadModel(payload)
        docKey.value = result.docKey
        releaseModel.value = result.release
      } catch (error) {
        console.error(error)
        notifyErrorDebug(error)
      }
    })
  }

  function getModelAndViewModel () {
    modelGetter.value === null && (() => { throw new Error('modelGetter not specified') })()
    docKey.value === null && (() => { throw new Error('docKey not specified') })()

    muteViewerWatch.value = true
    model.value = modelGetter.value(docKey.value)

    if (hasEditor.value) {
      viewModelGetter.value === null && (() => { throw new Error('viewModelGetter not specified') })()
      viewModel.value = viewModelGetter.value(docKey.value)
    }

    void nextTick(() => { muteViewerWatch.value = false })
  }

  return {
    findKey,
    modelFindKeyField,
    docKey,
    model,
    viewModel,
    modelGetter,
    viewModelGetter,
    releaseModel,
    updateModel,
    deleteModel,
    m,
    vm,
    loadModel,
    getModelAndViewModel
  }
}

export class UsePageDataHelper<T = unknown, TVm = unknown> {
  Return = usePageData<T, TVm>(() => undefined, ref(false), ref(false), ref(false), ref(false))
}
