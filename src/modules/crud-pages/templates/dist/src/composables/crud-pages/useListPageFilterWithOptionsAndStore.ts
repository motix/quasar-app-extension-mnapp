import { createMapper } from '@automapper/core';
import { pojos } from '@automapper/pojos';

import { QueryConstraint } from 'firebase/firestore';

import { DocModel, useStore } from 'stores/firebase-firestore';

import { ListPage } from './useListPage';
import useListPageFilterWithOptions from './useListPageFilterWithOptions';

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
  'docPage' | 'loadDocsPage' | 'releaseDocs'
>;

export default function useListPageFilterWithOptionsAndStore<
  T extends DocModel,
  FilterType
>(
  ready: ListPage<never>['ready'],
  queryConstraints: ListPage<never>['queryConstraints'],
  initialFilter: FilterType,
  store: StoreType<T>,
  loadFirstPage: ListPage<never>['loadFirstPage'],
  resetItems: ListPage<T>['resetItems'],
  ...options: {
    type: FilterType;
    label: string;
    selectedLabel?: string;
    queryConstraints: QueryConstraint[];
  }[]
) {
  return useListPageFilterWithOptions<FilterType>(
    ready,
    queryConstraints,
    initialFilter,
    () => {
      store.releaseDocs({ immediately: true });

      return loadFirstPage(
        (payload) => store.loadDocsPage(payload),
        // done
        () => {
          resetItems(store.docPage(0) as T[]);
        }
      );
    },
    ...options
  );
}
