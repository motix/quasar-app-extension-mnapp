import { createMapper } from '@automapper/core';
import { pojos } from '@automapper/pojos';

import { onActivated, onMounted, onUnmounted } from 'vue';

import { DocModel, useStore } from 'stores/firebase-firestore';

import { ListPage } from './useListPage';

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
  | 'recentlyAddedDocs'
  | 'recentlyUpdatedDocs'
  | 'recentlyDeletedDocs'
  | 'docPage'
  | 'loadDocsPage'
  | 'releaseDocs'
>;

export default function useListPageStore<T extends DocModel>(
  store: StoreType<T>,
  loadPage: ListPage<never>['loadPage'],
  appendItems: ListPage<T>['appendItems'],
  updateItems: ListPage<T>['updateItems'],
  loadOnMounted?: {
    ready: ListPage<never>['ready'];
    loadFirstPage: ListPage<never>['loadFirstPage'];
    resetItems: ListPage<T>['resetItems'];
  }
) {
  // Methods

  function onLoadNextPage(index: number, done: (stop: boolean) => void) {
    void loadPage(
      (payload) => store.loadDocsPage(payload),
      index,
      // done
      (stop) => {
        appendItems(store.docPage(index) as T[]);
        done(stop);
      }
    );
  }

  // Lifecycle Hooks

  if (loadOnMounted) {
    onMounted(() => {
      void loadOnMounted.loadFirstPage(
        (payload) => store.loadDocsPage(payload),
        // done
        () => {
          loadOnMounted.resetItems(store.docPage(0) as T[]);
          loadOnMounted.ready.value = true;
        }
      );
    });
  }

  onActivated(() => {
    updateItems(
      store.recentlyAddedDocs as T[],
      store.recentlyUpdatedDocs as T[],
      store.recentlyDeletedDocs
    );
  });

  onUnmounted(() => {
    store.releaseDocs({ immediately: false });
  });

  return {
    store,
    onLoadNextPage,
  };
}
