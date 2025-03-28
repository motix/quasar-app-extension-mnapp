import type { MapCallback, Mapper } from '@automapper/core';
import { createMapper } from '@automapper/core';
import { pojos } from '@automapper/pojos';

import type { UnwrapRef } from 'vue';

import type {
  _GettersTree,
  _StoreWithGetters,
  _StoreWithState,
  PiniaCustomProperties,
} from 'pinia';
import { acceptHMRUpdate, defineStore } from 'pinia';

import type { DocumentData } from 'firebase/firestore';

import buildActions from './actions.js';
import buildGetters from './getters.js';
import type {
  CreateDocActionPayload,
  DeleteDocActionPayload,
  DocModel,
  UpdateDocActionPayload,
} from './index.js';
import type { DocStateInterface } from './state.js';
import buildState from './state.js';

export * from 'models/firebase-firestore/index.js';
export * from './types.js';

export type StoreOptions<T, TVm, TAm> = {
  mapperOptions?: MapOptions<T, TAm>;
  afterLoad?: (docAm: TAm) => Promise<void>;
  afterLoadArray?: (docAms: TAm[]) => Promise<void>;
  beforeCreate?: (payload: CreateDocActionPayload<TVm>) => Promise<void>;
  beforeUpdate?: (payload: UpdateDocActionPayload<T | TVm>) => Promise<void>;
  beforeDelete?: (payload: DeleteDocActionPayload) => Promise<void>;
  autoGeneratedFields?: (keyof TAm)[];
};

export type MapOptions<T, TAm> = {
  apiModelToModelAfterMap?: MapCallback<TAm[], T[]>;
};

type S<T> = DocStateInterface<T>;

type GettersFlag<T> = { __flag: () => { model: T } };

export function defineGetters<T, G>(
  getters: GettersFlag<T> &
    G &
    ThisType<UnwrapRef<S<T>> & _StoreWithGetters<G> & PiniaCustomProperties> &
    _GettersTree<S<T>>,
) {
  const ret = getters as Omit<G, '__flag'> & Partial<GettersFlag<T>>;
  delete ret.__flag;
  return ret as Omit<G, '__flag'>;
}

class GettersHelper<T, TVm> {
  Return = buildGetters<T, TVm>(
    createMapper({
      strategyInitializer: pojos(),
    }),
    '',
    '',
  );
}

type G<T, TVm> = GettersHelper<T, TVm>['Return'];

type ActionFlag<T, TVm, TAm> = {
  __flag: (model: T, viewModel: TVm, apiModel: TAm) => { model: T; viewModel: TVm; apiModel: TAm };
};

export function defineActions<T, TVm, TAm, A>(
  actions: ActionFlag<T, TVm, TAm> &
    A &
    ThisType<
      A &
        UnwrapRef<S<T>> &
        _StoreWithState<string, S<T>, G<T, TVm>, A> &
        _StoreWithGetters<G<T, TVm>> &
        PiniaCustomProperties
    >,
) {
  const ret = actions as Omit<A, '__flag'> & Partial<ActionFlag<T, TVm, TAm>>;
  delete ret.__flag;
  return ret as Omit<A, '__flag'>;
}

export function useStore<T extends DocModel, TVm, TAm extends DocumentData>(
  id: string,
  collectionPath: string,
  mapper: Mapper,
  modelName: string,
  viewModelName: string,
  apiModelName: string,
  options?: StoreOptions<T, TVm, TAm>,
) {
  const state = () => buildState<T>();

  const getters = buildGetters<T, TVm>(mapper, modelName, viewModelName);

  const actions = buildActions<T, TVm, TAm>(
    collectionPath,
    mapper,
    modelName,
    viewModelName,
    apiModelName,
    options || {},
  );

  const store = defineStore(id, {
    state,
    getters,
    actions,
  });

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(store, import.meta.hot));
  }

  return store;
}
