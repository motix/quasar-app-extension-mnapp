import { createMapper } from '@automapper/core'
import { pojos } from '@automapper/pojos'
import buildState, { DocStateInterface } from './state'
import buildGetters from './getters'
import buildActions from './actions'
// Main
import { defineStore, acceptHMRUpdate } from 'pinia'
// Types
import type { Mapper } from '@automapper/core'
import type {
  _GettersTree,
  _StoreWithGetters,
  _StoreWithState,
  PiniaCustomProperties
} from 'pinia'
import type { UnwrapRef } from 'vue'
import type { DocWithId } from '.'

export * from './types'

type S<T> = DocStateInterface<T>

type GettersFlag<T> = { __flag: () => { model: T } }

export function defineGetters<T, G> (getters: GettersFlag<T> & G & ThisType<UnwrapRef<S<T>> & _StoreWithGetters<G> & PiniaCustomProperties> & _GettersTree<S<T>>) {
  const ret = getters as Omit<G, '__flag'> & Partial<GettersFlag<T>>
  delete ret.__flag
  return ret as Omit<G, '__flag'>
}

class GettersHelper<T extends DocWithId, TVm> {
  Return = buildGetters<T, TVm>(
    createMapper({
      name: '',
      pluginInitializer: pojos
    }),
    '', '')
}

type G<T extends DocWithId, TVm> = GettersHelper<T, TVm>['Return']

type ActionFlag<T, TVm, TAm> = { __flag: (model: T, viewModel: TVm, apiModel: TAm) => { model: T, viewModel: TVm, apiModel: TAm } }

export function defineActions<T extends DocWithId, TVm, TAm, A> (actions: ActionFlag<T, TVm, TAm> & A & ThisType<A & UnwrapRef<S<T>> & _StoreWithState<string, S<T>, G<T, TVm>, A> & _StoreWithGetters<G<T, TVm>> & PiniaCustomProperties>) {
  const ret = actions as Omit<A, '__flag'> & Partial<ActionFlag<T, TVm, TAm>>
  delete ret.__flag
  return ret as Omit<A, '__flag'>
}

export function useStore<T extends DocWithId, TVm, TAm> (
  id: string,
  collectionPath: string,
  mapper: Mapper,
  modelName: string,
  viewModelName: string,
  apiModelName: string
) {
  const state = () => buildState<T>()

  const getters = buildGetters<T, TVm>(
    mapper,
    modelName,
    viewModelName
  )

  const actions = buildActions<T, TVm, TAm>(
    collectionPath,
    mapper,
    modelName,
    viewModelName,
    apiModelName
  )

  const store = defineStore(id, {
    state,
    getters,
    actions
  })

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(store, import.meta.hot))
  }

  return store
}