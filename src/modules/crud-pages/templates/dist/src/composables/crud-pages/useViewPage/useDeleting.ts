import { ref } from 'vue';

import { Dialog } from 'quasar';

import { DeleteDocActionPayload } from 'stores/firebase-firestore';

import useNotifications from 'composables/useNotifications';
import useReturnUrl from 'composables/useReturnUrl';

import usePageData from './usePageData';
import usePageStatus from './usePageStatus';

export default function useDeleting(
  goBack: ReturnType<typeof useReturnUrl>['goBack'],
  freezed: ReturnType<typeof usePageStatus>['freezed'],
  muteRealtimeUpdate: ReturnType<typeof usePageStatus>['muteRealtimeUpdate'],
  docKey: ReturnType<typeof usePageData>['docKey'],
  deleteModel: ReturnType<typeof usePageData>['deleteModel'],
) {
  // Composables

  const {
    notifyErrorDebug,
    notifyDeleteDataSuccessAndRedirect,
    notifyDeleteDataError,
  } = useNotifications();

  // Data

  const deleting = ref(false);

  // Methods

  function trash() {
    docKey.value === null &&
      (() => {
        throw new Error('docKey not specified');
      })();
    deleteModel.value === null &&
      (() => {
        throw new Error('deleteModel not specified');
      })();

    Dialog.create({
      title: 'Delete',
      message: 'Are you sure want to delete the information?',
      cancel: true,
      persistent: true,
    }).onOk(() => {
      docKey.value === null &&
        (() => {
          throw new Error('docKey not specified');
        })();
      deleteModel.value === null &&
        (() => {
          throw new Error('deleteModel not specified');
        })();

      freezed.value = true;
      muteRealtimeUpdate.value = true;
      deleting.value = true;

      const payload: DeleteDocActionPayload = {
        docKey: docKey.value,
      };

      deleteModel
        .value(payload)
        .then(() => {
          notifyDeleteDataSuccessAndRedirect();
          deleting.value = false;
          goBack();
        })
        .catch((error: Error) => {
          console.error(error);
          notifyDeleteDataError();
          notifyErrorDebug(error);

          deleting.value = false;
          muteRealtimeUpdate.value = false;
          freezed.value = false;
        });
    });
  }

  return {
    deleting,
    trash,
  };
}
