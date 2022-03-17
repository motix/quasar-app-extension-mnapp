<script setup lang="ts">
import { useFloatToolbarResult } from 'composables/useFloatToolbar'
import { ref, computed, useSlots, Comment } from 'vue'

import type { QFab } from 'quasar'

// Props

const props = withDefaults(defineProps<{
  position?:
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';
  minMarginY?: number;
  // eslint-disable-next-line vue/require-default-prop
  fabButtonsVisibility?: Record<string, boolean>;
  fabButtonsSpaceIgnored?: number;
  offset?: { x?: number; y?: number };
}>(), {
  position: 'bottom-right',
  minMarginY: 2,
  fabButtonsSpaceIgnored: 0,
  offset: () => ({})
})

// Slots

const slots = useSlots()

// Composables

const {
  floatToolbarOffsetTop,
  floatToolbarOffsetBottom
} = useFloatToolbarResult()

// Data

const PAGE_PADDING = 16
const QFAB_BTN_SIZE = 56
const QFAB_ACTIONS_PADDING = 3
const QFAB_ACTIONS_MARGIN = 9
const QBTN_MARGIN = 5
const QBTN_SIZE = 42

const fab = ref<QFab | null>(null)
const fabOpened = ref<boolean>(false)

// Computed

const fabButtonsCount = computed(() => {
  let count = 0

  if (props.fabButtonsVisibility) {
    for (const button in props.fabButtonsVisibility) {
      if (props.fabButtonsVisibility[button]) count++
    }
  } else if (slots.default) {
    for (const item of slots.default()) {
      if (item.type !== Comment) count++
    }
  }

  return count
})

const showFab = computed(() => !!slots.default && fabButtonsCount.value > 0)

const offsetX = computed(() => PAGE_PADDING - (!showFab.value ? QBTN_MARGIN : 0) + (props.offset.x || 0))

const offsetY = computed(() => {
  const buttonSize = !showFab.value ? QBTN_SIZE : QFAB_BTN_SIZE

  if (props.position.includes('top')) {
    return Math.max(
      floatToolbarOffsetTop.value - (buttonSize / 2),
      -(buttonSize / 2),
      props.minMarginY) +
          (props.offset.y || 0)
  } else if (props.position.includes('bottom')) {
    return Math.max(
      floatToolbarOffsetBottom.value - (buttonSize / 2),
      -(buttonSize / 2),
      props.minMarginY) +
          (props.offset.y || 0)
  } else {
    return 0
  }
})

const marginStyle = computed(() => {
  const style: Record<string, unknown> = {}

  if (props.position.includes('top')) {
    style['margin-bottom'] = '0px'
  }
  if (props.position.includes('bottom')) {
    style['margin-top'] = '0px'
  }
  if (props.position.includes('left')) {
    style['margin-right'] = '0px'
  }
  if (props.position.includes('right')) {
    style['margin-left'] = '0px'
  }

  return style
})

const fixedButtonsPosition = computed(() => {
  if (!showFab.value) {
    return 0
  }

  return (QFAB_ACTIONS_PADDING + QFAB_ACTIONS_MARGIN) +
        (fabOpened.value ? (QBTN_SIZE + QBTN_MARGIN * 2) * (fabButtonsCount.value - props.fabButtonsSpaceIgnored) : 0)
})

// Methods

function open () {
  fab.value && fab.value.show()
}

function onBeforeShow () {
  fabOpened.value = true
}

function onBeforeHide () {
  fabOpened.value = false
}

// Expose

defineExpose({
  open
})
</script>

<template>
  <q-page-sticky
    :offset="[offsetX, offsetY]"
    :position="position"
    style="z-index: 2500"
    :style="marginStyle"
  >
    <div class="flex flex-center">
      <transition-group
        class="fixed-buttons z-top row reverse"
        name="float-toolbar-transition"
        :style="{ transform: `translateX(-${fixedButtonsPosition}px)` }"
        tag="div"
      >
        <slot name="fixed-buttons" />
      </transition-group>
      <q-fab
        v-if="showFab"
        ref="fab"
        color="accent"
        direction="left"
        icon="fal fa-ellipsis-h-alt"
        @before-hide="onBeforeHide"
        @before-show="onBeforeShow"
      >
        <transition-group
          class="no-wrap row reverse"
          name="float-toolbar-transition"
          tag="div"
        >
          <slot />
        </transition-group>
      </q-fab>
    </div>
  </q-page-sticky>
</template>

<style lang="scss" >
.fixed-buttons {
  transition: transform 0.18s ease-in;

  .q-btn {
    margin: 0 5px;
  }
}

.float-toolbar-transition-enter-active,
.float-toolbar-transition-leave-active {
  transition: all 0.3s;
}

.float-toolbar-transition-enter-from,
.float-toolbar-transition-leave-to {
  margin-right: -47px !important;
  opacity: 0;

  &.q-btn.disabled,
  &.disabled,
  &[disabled] {
    opacity: 0 !important;
  }
}
</style>
