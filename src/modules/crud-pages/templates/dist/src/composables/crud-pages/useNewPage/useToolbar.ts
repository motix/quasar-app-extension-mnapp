import { ref } from 'vue';

import FloatToolbar from 'components/shared/FloatToolbar.vue';

export default function useToolbar() {
  // Data

  const toolbar = ref<InstanceType<typeof FloatToolbar> | null>(null);

  // Methods

  function openToolbar() {
    toolbar.value?.open();
  }

  return {
    toolbar,
    openToolbar,
  };
}
