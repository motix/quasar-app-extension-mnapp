import { computed, ref } from 'vue';

import type { QTable } from 'quasar';

import type { UseClientFilterHelper } from './useClientFilter.js';

type QTableColumnOriginal =
  NonNullable<QTable['columns']> extends readonly (infer ElementType)[] ? ElementType : never;

export interface QTableColumn<TRow> extends QTableColumnOriginal {
  field: string | ((row: TRow) => unknown);
  format?: (val: unknown, row: TRow) => unknown;
  style?: string | ((row: TRow) => string);
  classes?: string | ((row: TRow) => string);
}

export type QTablePagination = NonNullable<QTable['pagination']>;

export default function useTableView<
  T extends NonNullable<unknown>,
  TRow extends NonNullable<unknown>,
>(clientFilteredItems: UseClientFilterHelper<T>['Return']['clientFilteredItems']) {
  // Data

  const wrapCells = ref(false);
  const columns = ref<QTableColumn<TRow>[] | null>(null);
  const pagination = ref<QTablePagination>({ rowsPerPage: 0 });

  // Method Refs

  const buildRows = ref<((items: T[]) => TRow[]) | null>(null);
  const onRowClick = ref<((evt: Event, row: TRow) => void) | null>(null);

  // Computed

  const rows = computed(() =>
    buildRows.value === null
      ? (clientFilteredItems.value as TRow[] | null)
      : clientFilteredItems.value === null
        ? null
        : buildRows.value(clientFilteredItems.value),
  );

  return {
    wrapCells,
    columns,
    pagination,
    rows,
    buildRows,
    onRowClick,
  };
}
