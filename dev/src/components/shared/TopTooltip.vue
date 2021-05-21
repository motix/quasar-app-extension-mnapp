<template>
  <q-tooltip
    anchor="top middle"
    self="bottom middle"
  >
    <slot />
  </q-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TopTooltip'
})
</script>
