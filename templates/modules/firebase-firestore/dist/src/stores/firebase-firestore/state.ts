import type { RealtimeDocIndex } from './';

import { requiredConfigEntries } from 'composables/useConfig';

function buildState<T>() {
  const { docsPageSize } = requiredConfigEntries('docsPageSize');

  return {
    docsPageSize,
    docs: [] as T[],
    realtimeDocs: {} as RealtimeDocIndex<T>,
    recentlyAddedDocs: [] as T[],
    recentlyUpdatedDocs: [] as T[],
    recentlyDeletedDocs: [] as string[],
  };
}

class StateHelper<T> {
  Return = buildState<T>();
}

export type DocStateInterface<T> = StateHelper<T>['Return'];

export default buildState;
