import {
  ComponentPublicInstance,
  computed,
  nextTick,
  Ref,
  ref,
  watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Dialog } from 'quasar';

import { UpdateDocActionPayload } from 'stores/firebase-firestore';

import { ViewPage } from 'composables/crud-pages/useViewPage';
import useNotifications from 'composables/useNotifications';
import useScroll from 'composables/useScroll';

export default function useViewChildPage<
  TChild = unknown,
  TChildVm = unknown,
  TParent = unknown,
  TParentVm = unknown
>($p: ViewPage<TChild, TChildVm, Record<string, unknown>>) {
  // Private

  const route = useRoute();
  const router = useRouter();

  const { notifyErrorDebug, notifySaveDataSuccess, notifySaveDataError } =
    useNotifications();

  const { toTop: scrollToTop, toElement: scrollToElement } = useScroll();

  // Data

  const hasChildDeleting = ref(true);
  const parentFindKey = ref(route.params.parentFindKey as string);
  const parentModel = ref(null) as Ref<TParent | null>;
  const parentViewModel = ref(null) as Ref<TParentVm | null>;
  const viewUrl = ref<string | null>(null);
  const childViewerRef = ref<ComponentPublicInstance | null>(null);

  // Computed

  const pm = computed(
    () =>
      parentModel.value ||
      (() => {
        throw new Error('parentModel not ready');
      })()
  );
  const pvm = computed(
    () =>
      parentViewModel.value ||
      (() => {
        throw new Error('parentViewModel not ready');
      })()
  );

  // Method Refs

  const parentModelGetter = ref<((docKey: string) => TParent | null) | null>(
    null
  );
  const parentViewModelGetter = ref<
    ((docKey: string) => TParentVm | null) | null
  >(null);
  const modelChildrenGetter = ref<((parentModel: TParent) => TChild[]) | null>(
    null
  );
  const viewModelChildrenGetter = ref<
    ((parentViewModel: TParentVm) => TChildVm[]) | null
  >(null);
  const removeChildMethod = ref<((child: TChild) => void) | null>(null);
  const updateParentModel = ref<
    | ((payload: UpdateDocActionPayload<TParent | TParentVm>) => Promise<void>)
    | null
  >(null);

  // Computed

  const showDeleteButton = computed(
    () => hasChildDeleting.value && !!$p.model.value
  );

  // Private Executions

  // usePageData
  $p.modelGetter.value = (docKey, realtimeUpdate) => {
    parentModelGetter.value === null &&
      (() => {
        throw new Error('parentModelGetter not specified');
      })();
    modelChildrenGetter.value === null &&
      (() => {
        throw new Error('modelChildrenGetter not specified');
      })();

    parentModel.value = parentModelGetter.value(docKey);

    if (parentModel.value === null) {
      return null;
    }

    const children = modelChildrenGetter.value(parentModel.value);

    if (children.length === 0) {
      realtimeUpdate &&
        Dialog.create({
          title: 'Deleted',
          message:
            "This page's data is deleted. You will be redireted to previous page.",
          persistent: true,
          ok: {
            color: 'primary',
          },
        }).onOk(() => {
          $p.goBack();
        });

      return null;
    }

    if (!$p.findKey.value) {
      $p.findKey.value = String(
        children[children.length - 1][$p.modelFindKeyField.value]
      );
    } else {
      $p.findKey.value = $p.findKey.value.replaceAll('_', '.');
    }

    const child = children.find(
      (value) => String(value[$p.modelFindKeyField.value]) === $p.findKey.value
    );

    !child &&
      realtimeUpdate &&
      Dialog.create({
        title: 'Deleted',
        message:
          "This page's data is deleted. You will be redireted to previous page.",
        persistent: true,
        ok: {
          color: 'primary',
        },
      }).onOk(() => {
        $p.goBack();
      });

    return child || null;
  };
  $p.viewModelGetter.value = (docKey) => {
    parentViewModelGetter.value === null &&
      (() => {
        throw new Error('parentViewModelGetter not specified');
      })();
    viewModelChildrenGetter.value === null &&
      (() => {
        throw new Error('viewModelChildrenGetter not specified');
      })();

    parentViewModel.value = parentViewModelGetter.value(docKey);

    if (parentViewModel.value === null) {
      return null;
    }

    const children = viewModelChildrenGetter.value(parentViewModel.value);

    if (children.length === 0) {
      return null;
    }

    if (!$p.findKey.value) {
      $p.findKey.value = String(
        children[children.length - 1][$p.modelFindKeyField.value]
      );
    } else {
      $p.findKey.value = $p.findKey.value.replaceAll('_', '.');
    }

    return (
      children.find(
        (value) =>
          String(value[$p.modelFindKeyField.value]) === $p.findKey.value
      ) || null
    );
  };
  $p.updateModel.value = (payload) => {
    updateParentModel.value === null &&
      (() => {
        throw new Error('updateParentModel not specified');
      })();

    if (payload.isViewModel) {
      parentViewModel.value === null &&
        (() => {
          throw new Error('parentViewModel not specified');
        })();

      return updateParentModel.value({
        docKey: payload.docKey,
        doc: parentViewModel.value,
        isViewModel: payload.isViewModel,
      });
    }

    parentModel.value === null &&
      (() => {
        throw new Error('parentModel not specified');
      })();

    return updateParentModel.value({
      docKey: payload.docKey,
      doc: parentModel.value,
      isViewModel: payload.isViewModel,
    });
  };

  // Methods

  function deleteChild() {
    Dialog.create({
      title: 'Delete',
      message: 'Are you sure want to delete the information?',
      cancel: true,
      persistent: true,
    }).onOk(() => {
      $p.docKey.value === null &&
        (() => {
          throw new Error('docKey not specified');
        })();
      $p.model.value === null &&
        (() => {
          throw new Error('model not specified');
        })();
      parentModel.value === null &&
        (() => {
          throw new Error('parentModel not specified');
        })();
      modelChildrenGetter.value === null &&
        (() => {
          throw new Error('modelChildrenGetter not specified');
        })();
      updateParentModel.value === null &&
        (() => {
          throw new Error('updateParentModel not specified');
        })();

      $p.freezed.value = true;
      $p.muteRealtimeUpdate.value = true;
      $p.deleting.value = true;

      const model = $p.model.value;
      const children = modelChildrenGetter.value(parentModel.value);

      $p.model.value =
        children.length > 1
          ? children.filter((value) => value !== model)[children.length - 2]
          : null;

      $p.exitEditMode();

      if (removeChildMethod.value) {
        removeChildMethod.value(model);
      } else {
        children.splice(children.indexOf(model), 1);
      }

      updateParentModel
        .value({
          docKey: $p.docKey.value,
          doc: parentModel.value,
          isViewModel: false,
        })
        .then(() => {
          parentModel.value === null &&
            (() => {
              throw new Error('parentModel not specified');
            })();
          modelChildrenGetter.value === null &&
            (() => {
              throw new Error('modelChildrenGetter not specified');
            })();

          notifySaveDataSuccess();
          $p.deleting.value = false;

          if (modelChildrenGetter.value(parentModel.value).length === 0) {
            $p.goBack();
          } else {
            $p.freezed.value = false;
          }
        })
        .catch((error: Error) => {
          console.error(error);
          notifySaveDataError();
          notifyErrorDebug(error);

          $p.deleting.value = false;
          $p.muteRealtimeUpdate.value = false;
          $p.freezed.value = false;
        });
    });
  }

  // Watch

  watch($p.model, (value) => {
    viewUrl.value === null &&
      (() => {
        throw new Error('viewUrl not specified');
      })();

    if (!value) {
      return;
    }

    const newFindKey = String(value[$p.modelFindKeyField.value]);

    if (newFindKey === $p.findKey.value) {
      return;
    }

    nextTick(() => {
      if (childViewerRef.value) {
        scrollToElement(childViewerRef.value);
      } else {
        scrollToTop();
      }
    });

    $p.findKey.value = newFindKey;

    route.meta.replaceRoute = true;
    router.replace(
      `${viewUrl.value}${parentFindKey.value}/${String(
        value[$p.modelFindKeyField.value]
      ).replaceAll('.', '_')}`
    );
  });

  return {
    hasChildDeleting,
    parentFindKey,
    parentModel,
    parentViewModel,
    viewUrl,
    childViewerRef,
    pm,
    pvm,
    parentModelGetter,
    parentViewModelGetter,
    modelChildrenGetter,
    viewModelChildrenGetter,
    removeChildMethod,
    updateParentModel,
    showDeleteButton,
    deleteChild,
  };
}

class UseViewChildPageHelper<TChild, TChildVm, TParent> {
  Return = useViewChildPage<TChild, TChildVm, TParent>(
    {} as ViewPage<TChild, TChildVm, Record<string, unknown>>
  );
}

export type ViewChildPage<TChild, TChildVm, TParent> = UseViewChildPageHelper<
  TChild,
  TChildVm,
  TParent
>['Return'];
