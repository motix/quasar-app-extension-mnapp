<script setup lang="ts">
// Main
import { ref } from 'vue'
// Types
import type { QTooltip } from 'quasar'

// Data

const tooltip = ref<InstanceType<typeof QTooltip> | null>(null)

// Methods

function hide () {
  tooltip.value?.hide()
}

// Expose

defineExpose({
  hide
})
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
