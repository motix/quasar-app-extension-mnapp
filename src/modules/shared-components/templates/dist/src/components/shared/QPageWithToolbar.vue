<script setup lang="ts">
// Constants

// TODO: Props and config
const TOOLBAR_HEIGHT = 50

// Methods

function styleFn (offset: number, height: number) {
  return {
    minHeight: `${height - offset - TOOLBAR_HEIGHT}px`
  }
}
</script>

<template>
  <q-page
    v-bind="$attrs"
    :style-fn="styleFn"
  >
    <slot />
  </q-page>
</template>
