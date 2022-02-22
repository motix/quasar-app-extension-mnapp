import useNotifications from 'composables/useNotifications'
// Main
import { ref, watch, WatchSource } from 'vue'
// Types
import type { UpdateDocActionPayload } from 'services/firebase-firestore'
import type usePageStatus from './usePageStatus'
import type usePageData from './usePageData'
import type { UsePageDataHelper } from './usePageData'

export default function useViewer<T = unknown, TVm = unknown> (
  freezed: ReturnType<typeof usePageStatus>['freezed'],
  muteNextRealtimeUpdate: ReturnType<typeof usePageStatus>['muteNextRealtimeUpdate'],
  muteViewerWatch: ReturnType<typeof usePageStatus>['muteViewerWatch'],
  editMode: ReturnType<typeof usePageStatus>['editMode'],
  docKey: ReturnType<typeof usePageData>['docKey'],
  model: UsePageDataHelper<T, never>['Return']['model'],
  viewModel: UsePageDataHelper<never, TVm>['Return']['viewModel'],
  mapper: ReturnType<typeof usePageData>['mapper'],
  updateModel: UsePageDataHelper<never, TVm>['Return']['updateModel']
) {
  // Private

  const {
    notifyErrorDebug,
    notifySaveDataSuccess,
    notifySaveDataError
  } = useNotifications()

  async function viewerSave () {
    docKey.value === null && (() => { throw new Error('docKey not specified') })()
    viewModel.value === null && (() => { throw new Error('viewModel not specified') })()
    updateModel.value === null && (() => { throw new Error('updateModel not specified') })()

    freezed.value = true
    muteNextRealtimeUpdate.value = true

    const payload: UpdateDocActionPayload<TVm> = {
      docKey: docKey.value,
      doc: viewModel.value
    }

    try {
      await updateModel.value(payload)
    } catch (error) {
      console.error(error)
      notifySaveDataError()
      notifyErrorDebug(error)

      muteNextRealtimeUpdate.value = false
      freezed.value = false
      return
    }

    notifySaveDataSuccess()
    freezed.value = false
  }

  // Data

  const modelTypeName = ref<string | null>(null)
  const viewModelTypeName = ref<string | null>(null)

  // Methods

  function watchViewer (...sources: WatchSource[]) {
    for (const source of sources) {
      watch(source, async (_newValue, oldValue) => {
        if (muteViewerWatch.value || editMode.value || oldValue === undefined) {
          return
        }

        modelTypeName.value === null && (() => { throw new Error('modelTypeName not specified') })()
        viewModelTypeName.value === null && (() => { throw new Error('viewModelTypeName not specified') })()
        mapper.value === null && (() => { throw new Error('mapper not specified') })()

        viewModel.value = mapper.value.map<T, TVm>(model.value as T, viewModelTypeName.value, modelTypeName.value)
        await viewerSave()
      })
    }
  }

  return {
    modelTypeName,
    viewModelTypeName,
    watchViewer
  }
}
