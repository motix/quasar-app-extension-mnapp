<script setup lang="ts">
import { ref } from 'vue';

import { QTooltip } from 'quasar';

// Data

const tooltip = ref<InstanceType<typeof QTooltip> | null>(null);

// Methods

function hide() {
  tooltip.value?.hide();
}

// Expose

defineExpose({
  hide,
});
</script>

<template>
  <q-tooltip
    v-bind="$attrs"
    ref="tooltip"
    anchor="top middle"
    self="bottom middle"
  >
    <slot />
  </q-tooltip>
</template>
