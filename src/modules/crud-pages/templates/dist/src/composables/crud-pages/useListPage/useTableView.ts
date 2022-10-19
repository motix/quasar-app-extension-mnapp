import { ref } from 'vue';

import { QTable } from 'quasar';

type QTableColumnOriginal = NonNullable<
  QTable['columns']
> extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export interface QTableColumn<T> extends QTableColumnOriginal {
  field: string | ((row: T) => unknown);
  format?: (val: unknown, row: T) => unknown;
  style?: string | ((row: T) => string);
  classes?: string | ((row: T) => string);
}

export type QTablePagination = NonNullable<QTable['pagination']>;

export default function useTableView<T extends NonNullable<unknown>>() {
  // Data

  const wrapCells = ref(false);
  const columns = ref<QTableColumn<T>[] | null>(null);
  const pagination = ref<QTablePagination>({ rowsPerPage: 0 });

  return {
    wrapCells,
    columns,
    pagination,
  };
}
