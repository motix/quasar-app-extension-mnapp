import { computed, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Dialog, Notify } from 'quasar';

import {
  LoadRealtimeDocActionPayload,
  LoadRealtimeDocActionResult,
  UpdateDocActionPayload,
} from 'stores/firebase-firestore';

import { NewPage } from 'composables/crud-pages/useNewPage';
import useNotifications from 'composables/useNotifications';

export default function useNewChildPage<
  TChildVm = unknown,
  TParentVm = unknown
>($p: NewPage<TChildVm, Record<string, unknown>>) {
  // Private

  const router = useRouter();
  const route = useRoute();

  const { notifyErrorDebug, notifyLoadDataError } = useNotifications();

  // Data

  const muteRealtimeUpdate = ref(false);
  const parentFindKey = ref(
    ((route.params.parentFindKey as string) || '').replaceAll('_', '.')
  );
  const parentModelFindKeyField = ref<Extract<keyof TParentVm, string>>(
    'id' as Extract<keyof TParentVm, string>
  ) as Ref<Extract<keyof TParentVm, string>>;
  const parentDocKey = ref<string | null>(null);
  const parentViewModel = ref(null) as Ref<TParentVm | null>;

  // Computed

  const pvm = computed(
    () =>
      parentViewModel.value ||
      (() => {
        throw new Error('parentViewModel not ready');
      })()
  );

  // Method Refs

  const parentViewModelGetter = ref<
    ((parentDocKey: string) => TParentVm | null) | null
  >(null);
  const releaseParentModel = ref<(() => void) | null>(null);
  const addChild = ref<((child: TChildVm) => void) | null>(null);
  const updateParentModel = ref<
    ((payload: UpdateDocActionPayload<TParentVm>) => Promise<void>) | null
  >(null);

  // Private Executions

  // usePageData
  $p.createModel.value = async (payload) => {
    parentDocKey.value === null &&
      (() => {
        throw new Error('parentDocKey not specified');
      })();
    addChild.value === null &&
      (() => {
        throw new Error('addChild not specified');
      })();
    updateParentModel.value === null &&
      (() => {
        throw new Error('updateParentModel not specified');
      })();

    addChild.value(payload.doc);

    muteRealtimeUpdate.value = true;

    try {
      await updateParentModel.value({
        docKey: parentDocKey.value,
        doc: pvm.value,
        isViewModel: true,
      });
    } catch (error) {
      muteRealtimeUpdate.value = false;

      throw error;
    }

    return payload.doc;
  };

  // Methods

  function loadParentModel(
    loadParentModel: (
      payload: LoadRealtimeDocActionPayload
    ) => LoadRealtimeDocActionResult
  ) {
    return new Promise<void>((resolve) => {
      let resolveOnce: typeof resolve | null = resolve;

      const payload: LoadRealtimeDocActionPayload = {
        findKey: parentFindKey.value,
        // Asuming view model and API model has this same field
        findKeyField:
          parentModelFindKeyField.value === 'id'
            ? undefined
            : parentModelFindKeyField.value,
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

          if (!parentViewModel.value) {
            getParentViewModel();
          } else {
            getParentViewModel();
            notifyRefreshDataSuccessIfNotMuted();
          }

          resolveOnce && resolveOnce();
          resolveOnce = null;
        },
        notFound: () => {
          void router.replace('/ErrorNotFound');
        },
        deleted: () => {
          Dialog.create({
            title: 'Deleted',
            message:
              "This page's data is deleted. You will be redireted to previous page.",
            persistent: true,
            ok: {
              color: 'primary',
            },
          }).onOk(() => {
            $p.isDirty.value = false;
            $p.confirmAndGoBack();
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
        const result = loadParentModel(payload);
        parentDocKey.value = result.docKey;
        releaseParentModel.value = result.release;
      } catch (error) {
        console.error(error);
        notifyErrorDebug(error);
      }
    });
  }

  function getParentViewModel() {
    parentDocKey.value === null &&
      (() => {
        throw new Error('parentDocKey not specified');
      })();
    parentViewModelGetter.value === null &&
      (() => {
        throw new Error('parentViewModelGetter not specified');
      })();

    parentViewModel.value = parentViewModelGetter.value(parentDocKey.value);

    if (parentViewModel.value) {
      const newParentFindKey = String(
        parentViewModel.value[parentModelFindKeyField.value]
      );

      if (newParentFindKey !== parentFindKey.value) {
        let path = route.fullPath;

        if (path.endsWith(parentFindKey.value.replaceAll('.', '_'))) {
          path =
            path.substring(0, path.length - parentFindKey.value.length) +
            newParentFindKey.replaceAll('.', '_');
        } else {
          path = path.replace(
            `/${parentFindKey.value}/`,
            `/${newParentFindKey.replaceAll('.', '_')}/`
          );
        }
        parentFindKey.value = newParentFindKey;
        delete route.meta.history;
        void router.replace(path);
      }
    }
  }

  return {
    newChildPageInitialized: undefined as boolean | undefined,
    parentFindKey,
    parentModelFindKeyField,
    parentDocKey,
    parentViewModel,
    pvm,
    parentViewModelGetter,
    releaseParentModel,
    addChild,
    updateParentModel,
    loadParentModel,
    getParentViewModel,
  };
}
