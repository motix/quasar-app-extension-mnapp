import type { ListPage } from './useListPage';
import type { QueryConstraint } from 'firebase/firestore';
import type { DocModel } from 'stores/firebase-firestore';

import { createMapper } from '@automapper/core';
import { pojos } from '@automapper/pojos';

import { useStore } from 'stores/firebase-firestore';

import useListPageFilterWithOptions from './useListPageFilterWithOptions';

class UseStoreHelper<T extends DocModel> {
  Return = useStore<T, never, never>(
    '',
    '',
    createMapper({
      strategyInitializer: pojos(),
    }),
    '',
    '',
    '',
  );
}

type StoreType<T extends DocModel> = Pick<
  ReturnType<UseStoreHelper<T>['Return']>,
  'docPage' | 'loadDocsPage' | 'releaseDocs'
>;

export default function useListPageFilterWithOptionsAndStore<T extends DocModel, FilterType>(
  ready: ListPage<never, never>['ready'],
  queryConstraints: ListPage<never, never>['queryConstraints'],
  initialFilter: FilterType,
  store: StoreType<T>,
  loadFirstPage: ListPage<never, never>['loadFirstPage'],
  resetItems: ListPage<T, never>['resetItems'],
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
        },
      );
    },
    ...options,
  );
}
