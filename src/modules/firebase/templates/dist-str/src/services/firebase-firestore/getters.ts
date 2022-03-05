import _ from 'lodash'
import { defineGetters } from '.'
// Types
import type { Mapper } from '@automapper/core'

function buildGetters<T, TVm> (
  mapper: Mapper,
  modelName: string,
  viewModelName: string
) {
  return defineGetters({
    __flag: () => ({ model: undefined as unknown as T }),

    doc: state =>
      (docKey: string) => {
        const doc = state.realtimeDocs[docKey].doc

        return doc
          ? _.cloneDeep(doc)
          : (() => { throw new Error(`Realtime doc '${docKey}' not available.`) })()
      },

    docVm: state =>
      (docKey: string) => {
        const doc = state.realtimeDocs[docKey].doc

        return doc
          ? mapper.map<T, TVm>(doc as T, viewModelName, modelName)
          : (() => { throw new Error(`Realtime doc '${docKey}' not available.`) })()
      },

    docPage: state =>
      (page: number) => state.docs.slice(
        page * state.docsPageSize,
        ((page + 1) * state.docsPageSize))
  })
}

export default buildGetters
