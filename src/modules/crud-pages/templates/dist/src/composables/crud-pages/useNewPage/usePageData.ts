import { computed, ref, Ref } from 'vue';

import { CreateDocActionPayload } from 'stores/firebase-firestore';

export default function usePageData<TVm extends NonNullable<unknown>>() {
  // Data

  const viewModel = ref(null) as Ref<TVm | null>;

  // Method Refs

  const createModel = ref<
    ((payload: CreateDocActionPayload<TVm>) => Promise<TVm>) | null
  >(null);

  // Computed

  const vm = computed(
    () =>
      viewModel.value ||
      (() => {
        throw new Error('viewModel not ready');
      })()
  );

  return {
    viewModel,
    createModel,
    vm,
  };
}

export class UsePageDataHelper<TVm extends NonNullable<unknown>> {
  Return = usePageData<TVm>();
}
