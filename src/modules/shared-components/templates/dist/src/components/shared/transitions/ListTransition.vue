<template>
  <transition-group
    class="overflow-hidden"
    :class="{ 'color-effect': colorEffect }"
    name="list-transition"
    tag="div"
    @after-enter="doneEnter"
    @after-leave="doneLeave"
    @before-enter="beforeEnter"
    @enter="enter"
    @enter-cancelled="doneEnter"
    @leave="leave"
    @leave-cancelled="doneLeave"
  >
    <slot />
  </transition-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ListTransition',

  props: {
    gutter: {
      type: Number,
      default: 0
    },
    colorEffect: {
      type: Boolean,
      default: false
    }
  },

  setup (props) {
    function beforeEnter (el: HTMLElement) {
      el.style.transition = 'opacity 0.5s, transform 0.5s, background-color 0.5s, margin-bottom 0s'
    }

    function enter (el: HTMLElement) {
      el.style.marginBottom = `-${el.clientHeight + props.gutter}px`
      setTimeout(() => {
        el.style.transition = 'opacity 0.5s, transform 0.5s, background-color 0.5s, margin-bottom 0.5s'
        el.style.marginBottom = '0'
      })
    }

    function doneEnter (el: HTMLElement) {
      el.style.marginBottom = ''
      el.style.transition = ''
    }

    function leave (el: HTMLElement) {
      el.style.marginTop = `-${el.clientHeight + props.gutter}px`
    }

    function doneLeave (el: HTMLElement) {
      el.style.marginTop = ''
    }

    return {
      beforeEnter,
      enter,
      doneEnter,
      leave,
      doneLeave
    }
  }
})
</script>

<style lang="scss">
.list-transition-leave-active {
  transition: all 0.5s;
}

.list-transition-enter-from,
.list-transition-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.color-effect .list-transition-enter-from {
  background-color: $primary !important;
}

.color-effect .list-transition-leave-to {
  background-color: $negative !important;
}
</style>
