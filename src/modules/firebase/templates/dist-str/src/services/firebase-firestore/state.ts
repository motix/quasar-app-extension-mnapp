import { requiredConfigEntries } from 'services/useConfig'
// Types
import type { RealtimeDocIndex } from '.'

const { docsPageSize } = requiredConfigEntries('docsPageSize')

function buildState<T> () {
  return {
    docsPageSize,
    docs: [] as T[],
    realtimeDocs: {} as RealtimeDocIndex<T>
  }
}

class StateHelper<T> {
  Return = buildState<T>()
}

export type DocStateInterface<T> = StateHelper<T>['Return']

export default buildState
