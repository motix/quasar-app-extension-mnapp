<template>
  <transition
    mode="out-in"
    name="fade-transition"
    v-bind="$attrs"
  >
    <slot />
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FadeTransition'
})
</script>

<style lang="scss">
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: all 0.3s;
}

.fade-transition-enter-from,
.fade-transition-leave-to {
  opacity: 0;

  &.q-btn.disabled,
  &.disabled,
  &[disabled] {
    opacity: 0 !important;
  }
}
</style>
