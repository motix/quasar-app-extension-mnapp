import { Dialog } from 'quasar'
import useNotifications from 'composables/useNotifications'
import { ref } from 'vue'

import type { DeleteDocActionPayload } from 'stores/firebase-firestore'
import type useReturnUrl from 'composables/useReturnUrl'
import type usePageStatus from './usePageStatus'
import type usePageData from './usePageData'

export default function useDeleting (
  goBack: ReturnType<typeof useReturnUrl>['goBack'],
  freezed: ReturnType<typeof usePageStatus>['freezed'],
  muteNextRealtimeUpdate: ReturnType<typeof usePageStatus>['muteNextRealtimeUpdate'],
  docKey: ReturnType<typeof usePageData>['docKey'],
  deleteModel: ReturnType<typeof usePageData>['deleteModel']
) {
  // Composables

  const {
    notifyErrorDebug,
    notifyDeleteDataSuccessAndRedirect,
    notifyDeleteDataError
  } = useNotifications()

  // Data

  const deleting = ref(false)

  // Methods

  function trash () {
    docKey.value === null && (() => { throw new Error('docKey not specified') })()
    deleteModel.value === null && (() => { throw new Error('deleteModel not specified') })()

    Dialog.create({
      title: 'Delete',
      message: 'Are you sure want to delete the information?',
      cancel: true,
      persistent: true
    })
      .onOk(() => {
        docKey.value === null && (() => { throw new Error('docKey not specified') })()
        deleteModel.value === null && (() => { throw new Error('deleteModel not specified') })()

        freezed.value = true
        muteNextRealtimeUpdate.value = true
        deleting.value = true

        const payload: DeleteDocActionPayload = {
          docKey: docKey.value
        }

        deleteModel.value(payload)
          .then(() => {
            notifyDeleteDataSuccessAndRedirect()
            deleting.value = false
            goBack()
          })
          .catch((error: Error) => {
            console.error(error)
            notifyDeleteDataError()
            notifyErrorDebug(error)

            deleting.value = false
            muteNextRealtimeUpdate.value = false
            freezed.value = false
          })
      })
  }

  return {
    deleting,
    trash
  }
}
