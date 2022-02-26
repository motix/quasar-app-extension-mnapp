import useNotifications from 'composables/useNotifications'
// Main
import { watch, WatchSource } from 'vue'
// Types
import type { UpdateDocActionPayload } from 'services/firebase-firestore'
import type usePageStatus from './usePageStatus'
import type usePageData from './usePageData'
import type { UsePageDataHelper } from './usePageData'

export default function useViewer<T = unknown> (
  freezed: ReturnType<typeof usePageStatus>['freezed'],
  muteNextRealtimeUpdate: ReturnType<typeof usePageStatus>['muteNextRealtimeUpdate'],
  muteViewerWatch: ReturnType<typeof usePageStatus>['muteViewerWatch'],
  editMode: ReturnType<typeof usePageStatus>['editMode'],
  docKey: ReturnType<typeof usePageData>['docKey'],
  model: UsePageDataHelper<T, never>['Return']['model'],
  updateModel: UsePageDataHelper<T, never>['Return']['updateModel']
) {
  // Private

  const {
    notifyErrorDebug,
    notifySaveDataSuccess,
    notifySaveDataError
  } = useNotifications()

  async function viewerSave () {
    docKey.value === null && (() => { throw new Error('docKey not specified') })()
    model.value === null && (() => { throw new Error('model not specified') })()
    updateModel.value === null && (() => { throw new Error('updateModel not specified') })()

    freezed.value = true
    muteNextRealtimeUpdate.value = true

    const payload: UpdateDocActionPayload<T> = {
      docKey: docKey.value,
      doc: model.value,
      isViewModel: false
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

  // Methods

  function watchViewer (...sources: WatchSource[]) {
    for (const source of sources) {
      watch(source, async (_newValue, oldValue) => {
        if (muteViewerWatch.value || editMode.value || oldValue === undefined) {
          return
        }

        await viewerSave()
      })
    }
  }

  return {
    watchViewer
  }
}
