import { requiredConfigEntries } from 'composables/useConfig'

import type { RealtimeDocIndex } from '.'

const { docsPageSize } = requiredConfigEntries('docsPageSize')

function buildState<T> () {
  return {
    docsPageSize,
    docs: [] as T[],
    realtimeDocs: {} as RealtimeDocIndex<T>,
    recentlyAddedDocs: [] as T[],
    recentlyUpdatedDocs: [] as T[],
    recentlyDeletedDocs: [] as string[]
  }
}

class StateHelper<T> {
  Return = buildState<T>()
}

export type DocStateInterface<T> = StateHelper<T>['Return']

export default buildState
