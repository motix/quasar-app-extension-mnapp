import { computed, nextTick, ref, Ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Dialog, Notify } from 'quasar';

import {
  DeleteDocActionPayload,
  LoadRealtimeDocActionPayload,
  LoadRealtimeDocActionResult,
  UpdateDocActionPayload,
} from 'stores/firebase-firestore';

import useNotifications from 'composables/useNotifications';
import useReturnUrl from 'composables/useReturnUrl';

import usePageFeatures from './usePageFeatures';
import usePageStatus from './usePageStatus';

export default function usePageData<T = unknown, TVm = unknown>(
  goBack: ReturnType<typeof useReturnUrl>['goBack'],
  hasEditor: ReturnType<typeof usePageFeatures>['hasEditor'],
  muteRealtimeUpdate: ReturnType<typeof usePageStatus>['muteRealtimeUpdate'],
  delayRealtimeUpdate: ReturnType<typeof usePageStatus>['delayRealtimeUpdate'],
  ignoreViewerWatch: ReturnType<typeof usePageStatus>['ignoreViewerWatch'],
  editMode: ReturnType<typeof usePageStatus>['editMode'],
  isDirty: ReturnType<typeof usePageStatus>['isDirty']
) {
  // Composables

  const router = useRouter();
  const route = useRoute();

  const { notifyErrorDebug, notifyLoadDataError } = useNotifications();

  // Data

  const findKey = ref(
    ((route.params.findKey as string) || '').replaceAll('_', '.')
  );
  const modelFindKeyField = ref<Extract<keyof T & keyof TVm, string>>(
    'id' as Extract<keyof T & keyof TVm, string>
  ) as Ref<Extract<keyof T & keyof TVm, string>>;
  const docKey = ref<string | null>(null);
  const model = ref(null) as Ref<T | null>;
  const viewModel = ref(null) as Ref<TVm | null>;
  const reloadDialogShowing = ref(false);

  // Method Refs

  const modelGetter = ref<
    ((docKey: string, realtimeUpdate: boolean) => T | null) | null
  >(null);
  const viewModelGetter = ref<
    ((docKey: string, realtimeUpdate: boolean) => TVm | null) | null
  >(null);
  const releaseModel = ref<(() => void) | null>(null);
  const updateModel = ref<
    ((payload: UpdateDocActionPayload<T | TVm>) => Promise<void>) | null
  >(null);
  const deleteModel = ref<
    ((payload: DeleteDocActionPayload) => Promise<void>) | null
  >(null);

  // Computed

  const m = computed(
    () =>
      model.value ||
      (() => {
        throw new Error('model not ready');
      })()
  );
  const vm = computed(
    () =>
      viewModel.value ||
      (() => {
        throw new Error('viewModel not ready');
      })()
  );

  // Methods

  function loadModel(
    loadModel: (
      payload: LoadRealtimeDocActionPayload
    ) => LoadRealtimeDocActionResult
  ) {
    return new Promise<void>((resolve) => {
      let resolveOnce: typeof resolve | null = resolve;

      const payload: LoadRealtimeDocActionPayload = {
        findKey: findKey.value,
        // Asuming view model and API model has this same field
        findKeyField:
          modelFindKeyField.value === 'id'
            ? undefined
            : modelFindKeyField.value,
        done: () => {
          const notifyRefreshDataSuccessIfNotMuted = () => {
            if (muteRealtimeUpdate.value) {
              muteRealtimeUpdate.value = false;
            } else {
              Notify.create({
                message: 'The page has just been refreshed with latest data.',
                type: 'info',
                actions: [{ icon: 'close', color: 'white' }],
              });
            }
          };

          if (!model.value) {
            getModelAndViewModel(false);
          } else if (delayRealtimeUpdate.value) {
            const stopWatch = watch(delayRealtimeUpdate, () => {
              if (delayRealtimeUpdate.value === false) {
                stopWatch();

                isDirty.value = false;
                getModelAndViewModel(true);
                notifyRefreshDataSuccessIfNotMuted();
              }
            });
          } else if (editMode.value) {
            if (!reloadDialogShowing.value) {
              reloadDialogShowing.value = true;

              Dialog.create({
                title: 'Refresh',
                message:
                  "This page's data has changed. Do you want to refresh?",
                cancel: true,
                persistent: true,
                ok: {
                  color: 'primary',
                },
              })
                .onOk(() => {
                  isDirty.value = false;
                  getModelAndViewModel(true);
                })
                .onDismiss(() => {
                  reloadDialogShowing.value = false;
                });
            }
          } else {
            getModelAndViewModel(true);
            notifyRefreshDataSuccessIfNotMuted();
          }

          resolveOnce && resolveOnce();
          resolveOnce = null;
        },
        notFound: () => {
          void router.replace('/ErrorNotFound');
        },
        deleted: () => {
          !muteRealtimeUpdate.value &&
            Dialog.create({
              title: 'Deleted',
              message:
                "This page's data is deleted. You will be redireted to previous page.",
              persistent: true,
              ok: {
                color: 'primary',
              },
            }).onOk(() => {
              goBack();
            });
        },
        error: (error) => {
          console.error(error);
          notifyLoadDataError();
          notifyErrorDebug(error);
          resolveOnce && resolveOnce();
          resolveOnce = null;
        },
      };

      try {
        const result = loadModel(payload);
        docKey.value = result.docKey;
        releaseModel.value = result.release;
      } catch (error) {
        console.error(error);
        notifyErrorDebug(error);
      }
    });
  }

  function getModelAndViewModel(realtimeUpdate: boolean) {
    docKey.value === null &&
      (() => {
        throw new Error('docKey not specified');
      })();
    modelGetter.value === null &&
      (() => {
        throw new Error('modelGetter not specified');
      })();

    ignoreViewerWatch.value = true;
    model.value = modelGetter.value(docKey.value, realtimeUpdate);

    if (hasEditor.value) {
      viewModelGetter.value === null &&
        (() => {
          throw new Error('viewModelGetter not specified');
        })();

      viewModel.value = viewModelGetter.value(docKey.value, realtimeUpdate);
    }

    if (model.value) {
      const newFindKey = String(model.value[modelFindKeyField.value]);

      if (newFindKey !== findKey.value) {
        let path = route.fullPath;

        if (path.endsWith(findKey.value.replaceAll('.', '_'))) {
          path =
            path.substring(0, path.length - findKey.value.length) +
            newFindKey.replaceAll('.', '_');
        } else {
          path = path.replace(
            `/${findKey.value}/`,
            `/${newFindKey.replaceAll('.', '_')}/`
          );
        }
        findKey.value = newFindKey;
        delete route.meta.history;
        void router.replace(path);
      }
    }

    void nextTick(() => {
      ignoreViewerWatch.value = false;
    });
  }

  // Watch

  // hasEditor might be specified based on model's data.
  // Get viewModel if not already get.
  watch(hasEditor, () => {
    if (hasEditor.value && model.value && !viewModel.value) {
      viewModelGetter.value === null &&
        (() => {
          throw new Error('viewModelGetter not specified');
        })();
      docKey.value === null &&
        (() => {
          throw new Error('docKey not specified');
        })();

      viewModel.value = viewModelGetter.value(docKey.value, false);
    }
  });

  return {
    findKey,
    modelFindKeyField,
    docKey,
    model,
    viewModel,
    reloadDialogShowing,
    modelGetter,
    viewModelGetter,
    releaseModel,
    updateModel,
    deleteModel,
    m,
    vm,
    loadModel,
    getModelAndViewModel,
  };
}

export class UsePageDataHelper<T = unknown, TVm = unknown> {
  Return = usePageData<T, TVm>(
    () => undefined,
    ref(false),
    ref(false),
    ref(false),
    ref(false),
    ref(false),
    ref(false)
  );
}
