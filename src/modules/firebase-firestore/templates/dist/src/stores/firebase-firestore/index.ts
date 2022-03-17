import { createMapper } from '@automapper/core'
import { pojos } from '@automapper/pojos'
import buildState, { DocStateInterface } from './state'
import buildGetters from './getters'
import buildActions from './actions'
// Main
import {
  // <% if (config.hasModule('vite')) { %>Start mnapp.vite module
  acceptHMRUpdate,
  // End<% } else { %>No<% } %> mnapp.vite module
  defineStore
} from 'pinia'
// Types
import type { Mapper, MapAction } from '@automapper/core'
import type {
  _GettersTree,
  _StoreWithGetters,
  _StoreWithState,
  PiniaCustomProperties
} from 'pinia'
import type { UnwrapRef } from 'vue'
import type { DocModel } from '.'

export * from './types'

export type MapOptions<T, TAm> = {
  apiModelToModelAfterMap?: MapAction<TAm[], T[]>;
}

type S<T> = DocStateInterface<T>

type GettersFlag<T> = { __flag: () => { model: T } }

export function defineGetters<T, G> (getters: GettersFlag<T> & G & ThisType<UnwrapRef<S<T>> & _StoreWithGetters<G> & PiniaCustomProperties> & _GettersTree<S<T>>) {
  const ret = getters as Omit<G, '__flag'> & Partial<GettersFlag<T>>
  delete ret.__flag
  return ret as Omit<G, '__flag'>
}

class GettersHelper<T, TVm> {
  Return = buildGetters<T, TVm>(
    createMapper({
      name: '',
      pluginInitializer: pojos
    }),
    '', '')
}

type G<T, TVm> = GettersHelper<T, TVm>['Return']

type ActionFlag<T, TVm, TAm> = { __flag: (model: T, viewModel: TVm, apiModel: TAm) => { model: T; viewModel: TVm; apiModel: TAm } }

export function defineActions<T, TVm, TAm, A> (actions: ActionFlag<T, TVm, TAm> & A & ThisType<A & UnwrapRef<S<T>> & _StoreWithState<string, S<T>, G<T, TVm>, A> & _StoreWithGetters<G<T, TVm>> & PiniaCustomProperties>) {
  const ret = actions as Omit<A, '__flag'> & Partial<ActionFlag<T, TVm, TAm>>
  delete ret.__flag
  return ret as Omit<A, '__flag'>
}

export function useStore<T extends DocModel, TVm, TAm> (
  id: string,
  collectionPath: string,
  mapper: Mapper,
  modelName: string,
  viewModelName: string,
  apiModelName: string,
  mapOptions?: MapOptions<T, TAm>
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
    apiModelName,
    mapOptions
  )

  const store = defineStore(id, {
    state,
    getters,
    actions
  })

  // <% if (config.hasModule('vite')) { %>Start mnapp.vite module
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(store, import.meta.hot))
  }
  // End<% } else { %>No<% } %> mnapp.vite module

  return store
}
