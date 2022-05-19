import { createMapper } from '@automapper/core';
import { pojos } from '@automapper/pojos';

import { onMounted, onUnmounted, ref, watch } from 'vue';

import { DocModel, useStore } from 'stores/firebase-firestore';
import { LoadAllDocsActionPayload } from 'stores/firebase-firestore/types';

import useNotifications from 'composables/useNotifications';

import useViewPage from './useViewPage';

class UseStoreHelper<T extends DocModel> {
  Return = useStore<T, never, never>(
    '',
    '',
    createMapper({
      name: '',
      pluginInitializer: pojos,
    }),
    '',
    '',
    ''
  );
}

type StoreType<T extends DocModel> = Pick<
  ReturnType<UseStoreHelper<T>['Return']>,
  'loadAllDocs' | 'releaseDocs'
>;

// useNewPage | useViewPage
export default function useEditorDependencies(
  editMode: undefined | ReturnType<typeof useViewPage>['editMode']
) {
  // Private

  let dependenciesLoading: number;

  function onDependenciesLoaded() {
    if (dependenciesLoading > 0) {
      return;
    }

    editorReady.value = true;
  }

  // Composables

  const { notifyErrorDebug, notifyLoadDataError } = useNotifications();

  // Data

  const editorReady = ref(false);
  const editorDependenciesStores = ref<
    {
      store: StoreType<never>;
      payload: Partial<LoadAllDocsActionPayload>;
    }[]
  >([]);

  // Private Executions

  // useNewPage or used in editor component
  if (!editMode) {
    onMounted(() => {
      loadEditorDepencencies();
    });

    onUnmounted(() => {
      releaseEditorDependencies();
    });
  }

  // Methods

  function loadEditorDepencencies() {
    dependenciesLoading = editorDependenciesStores.value.length;

    // Set editorReady if dependenciesStores is empty
    onDependenciesLoaded();

    editorDependenciesStores.value.forEach((value) => {
      value.store
        .loadAllDocs({ queryConstraints: value.payload.queryConstraints || [] })
        .then(() => {
          dependenciesLoading--;
          onDependenciesLoaded();
        })
        .catch((error) => {
          console.error(error);
          notifyLoadDataError();
          notifyErrorDebug(error);
          editorReady.value = true;
        });
    });
  }

  function releaseEditorDependencies() {
    editorDependenciesStores.value.forEach((value) =>
      value.store.releaseDocs({ immediately: false })
    );
  }

  // Watch

  // useViewPage
  if (editMode) {
    watch(editMode, (newValue) => {
      editorReady.value = false;

      if (newValue) {
        loadEditorDepencencies();
      } else {
        releaseEditorDependencies();
      }
    });
  }

  return {
    editorDependenciesInitialized: undefined as boolean | undefined,
    editorReady,
    editorDependenciesStores,
    loadEditorDepencencies,
    releaseEditorDependencies,
  };
}
