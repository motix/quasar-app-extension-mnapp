import { watch, WatchSource } from 'vue';

import { UpdateDocActionPayload } from 'stores/firebase-firestore';

import useNotifications from 'composables/useNotifications';

import usePageData, { UsePageDataHelper } from './usePageData';
import usePageStatus from './usePageStatus';

export default function useViewer<T extends NonNullable<unknown>>(
  freezed: ReturnType<typeof usePageStatus>['freezed'],
  muteRealtimeUpdate: ReturnType<typeof usePageStatus>['muteRealtimeUpdate'],
  ignoreViewerWatch: ReturnType<typeof usePageStatus>['ignoreViewerWatch'],
  editMode: ReturnType<typeof usePageStatus>['editMode'],
  docKey: ReturnType<typeof usePageData>['docKey'],
  model: UsePageDataHelper<T, never>['Return']['model'],
  updateModel: UsePageDataHelper<T, never>['Return']['updateModel'],
) {
  // Composables

  const { notifyErrorDebug, notifySaveDataSuccess, notifySaveDataError } =
    useNotifications();

  // Methods

  async function viewerSave(cb?: () => void) {
    docKey.value === null &&
      (() => {
        throw new Error('docKey not specified');
      })();
    model.value === null &&
      (() => {
        throw new Error('model not specified');
      })();
    updateModel.value === null &&
      (() => {
        throw new Error('updateModel not specified');
      })();

    freezed.value = true;
    muteRealtimeUpdate.value = true;

    const payload: UpdateDocActionPayload<T> = {
      docKey: docKey.value,
      doc: model.value,
      isViewModel: false,
    };

    try {
      await updateModel.value(payload);
    } catch (error) {
      console.error(error);
      notifySaveDataError();
      notifyErrorDebug(error);

      muteRealtimeUpdate.value = false;
      freezed.value = false;
      return;
    }

    notifySaveDataSuccess();
    freezed.value = false;

    cb && cb();
  }

  function watchViewer(...sources: WatchSource[]) {
    for (const source of sources) {
      watch(source, async (_newValue, oldValue) => {
        if (
          ignoreViewerWatch.value ||
          editMode.value ||
          oldValue === undefined
        ) {
          return;
        }

        await viewerSave();
      });
    }
  }

  function watchViewerAndRun(cb: () => void, ...sources: WatchSource[]) {
    for (const source of sources) {
      watch(source, async (_newValue, oldValue) => {
        if (
          ignoreViewerWatch.value ||
          editMode.value ||
          oldValue === undefined
        ) {
          return;
        }

        await viewerSave(cb);
      });
    }
  }

  return {
    viewerSave,
    watchViewer,
    watchViewerAndRun,
  };
}
