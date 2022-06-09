<script setup lang="ts">
import { Comment, computed, ref, useSlots } from 'vue';

import { QFab } from 'quasar';

import { useFloatToolbarResult } from 'composables/useFloatToolbar';

// Props

const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    position: 'bottom-right',
    minMarginY: 2,
    fabButtonsSpaceIgnored: 0,
    offset: () => ({}),
  }
);

// Slots

const slots = useSlots();

// Composables

const { floatToolbarOffsetTop, floatToolbarOffsetBottom } =
  useFloatToolbarResult();

// Data

const PAGE_PADDING = 16;
const QFAB_BTN_SIZE = 56;
const QFAB_ACTIONS_PADDING = 3;
const QFAB_ACTIONS_MARGIN = 9;
const QBTN_MARGIN = 5;
const QBTN_SIZE = 42;

const fab = ref<QFab | null>(null);
const fabOpened = ref<boolean>(false);

// Computed

const fabButtonsCount = computed(() => {
  let count = 0;

  if (props.fabButtonsVisibility) {
    for (const button in props.fabButtonsVisibility) {
      if (props.fabButtonsVisibility[button]) count++;
    }
  } else if (slots.default) {
    for (const item of slots.default()) {
      if (item.type !== Comment) count++;
    }
  }

  return count;
});

const showFab = computed(() => !!slots.default && fabButtonsCount.value > 0);

const offsetX = computed(
  () =>
    PAGE_PADDING - (!showFab.value ? QBTN_MARGIN : 0) + (props.offset.x || 0)
);

const offsetY = computed(() => {
  const buttonSize = !showFab.value ? QBTN_SIZE : QFAB_BTN_SIZE;

  if (props.position.includes('top')) {
    return (
      Math.max(
        floatToolbarOffsetTop.value - buttonSize / 2,
        -(buttonSize / 2),
        props.minMarginY
      ) + (props.offset.y || 0)
    );
  } else if (props.position.includes('bottom')) {
    return (
      Math.max(
        floatToolbarOffsetBottom.value - buttonSize / 2,
        -(buttonSize / 2),
        props.minMarginY
      ) + (props.offset.y || 0)
    );
  } else {
    return 0;
  }
});

const containerMargin = computed(() => {
  const style: Record<string, unknown> = {};

  if (props.position.includes('top')) {
    style['margin-bottom'] = '0px';
  }
  if (props.position.includes('bottom')) {
    style['margin-top'] = '0px';
  }
  if (props.position.includes('left')) {
    style['margin-right'] = '0px';
  }
  if (props.position.includes('right')) {
    style['margin-left'] = '0px';
  }

  return style;
});

const direction = computed(() => {
  if (
    props.position === 'top-left' ||
    props.position === 'bottom-left' ||
    props.position === 'left'
  ) {
    return 'right';
  } else if (
    props.position === 'top-right' ||
    props.position === 'bottom-right' ||
    props.position === 'right'
  ) {
    return 'left';
  } else if (props.position === 'top') {
    return 'down';
  } else if (props.position === 'bottom') {
    return 'up';
  } else {
    const _exhaustiveCheck: never = props.position;
    return _exhaustiveCheck;
  }
});

const reverseOrder = computed(() => {
  if (
    props.position === 'top-left' ||
    props.position === 'bottom-left' ||
    props.position === 'left' ||
    props.position === 'top' ||
    props.position === 'bottom'
  ) {
    return false;
  } else if (
    props.position === 'top-right' ||
    props.position === 'bottom-right' ||
    props.position === 'right'
  ) {
    return true;
  } else {
    const _exhaustiveCheck: never = props.position;
    return _exhaustiveCheck;
  }
});

const secondRowPosition = computed(() => {
  if (
    props.position === 'top-left' ||
    props.position === 'top-right' ||
    props.position === 'top' ||
    props.position === 'left' ||
    props.position === 'right'
  ) {
    return 'bottom';
  } else if (
    props.position === 'bottom-left' ||
    props.position === 'bottom-right' ||
    props.position === 'bottom'
  ) {
    return 'top';
  } else {
    const _exhaustiveCheck: never = props.position;
    return _exhaustiveCheck;
  }
});

const fabContentMargin = computed(() => {
  if (
    props.position === 'top-left' ||
    props.position === 'top-right' ||
    props.position === 'left' ||
    props.position === 'right'
  ) {
    return { 'margin-top': `${buttonSpace.value}px` };
  } else if (
    props.position === 'bottom-left' ||
    props.position === 'bottom-right'
  ) {
    return { 'margin-bottom': `${buttonSpace.value}px` };
  } else if (props.position === 'top' || props.position === 'bottom') {
    return {};
  } else {
    const _exhaustiveCheck: never = props.position;
    return _exhaustiveCheck;
  }
});

const buttonSpace = computed(() => QBTN_SIZE + QBTN_MARGIN * 2);

const fixedButtonsPosition = computed(() => {
  if (!showFab.value) {
    return 0;
  }

  if (props.position === 'top' || props.position === 'bottom') {
    return QFAB_ACTIONS_MARGIN;
  }

  return (
    (reverseOrder.value ? -1 : 1) *
    (QFAB_ACTIONS_PADDING +
      QFAB_ACTIONS_MARGIN +
      (fabOpened.value
        ? buttonSpace.value *
          (fabButtonsCount.value - props.fabButtonsSpaceIgnored)
        : 0))
  );
});

// Methods

function open() {
  fab.value && fab.value.show();
}

function onBeforeShow() {
  fabOpened.value = true;
}

function onBeforeHide() {
  fabOpened.value = false;
}

// Expose

defineExpose({
  open,
});
</script>

<template>
  <q-page-sticky
    :offset="[offsetX, offsetY]"
    :position="position"
    style="z-index: 2500"
    :style="containerMargin"
  >
    <div class="flex flex-center">
      <transition-group
        v-if="reverseOrder"
        class="fixed-buttons z-top row reverse"
        name="float-toolbar-transition"
        :style="{ transform: `translateX(${fixedButtonsPosition}px)` }"
        tag="div"
      >
        <slot name="fixed-buttons"></slot>
      </transition-group>

      <q-fab
        v-if="showFab"
        ref="fab"
        color="accent"
        :direction="direction"
        icon="fal fa-ellipsis-h-alt"
        @before-hide="onBeforeHide"
        @before-show="onBeforeShow"
      >
        <div style="pointer-events: none" :style="fabContentMargin">
          <transition-group
            v-if="secondRowPosition === 'top'"
            class="no-wrap row children-clickable"
            :class="{ reverse: reverseOrder }"
            name="float-toolbar-transition"
            :style="{ 'min-height': `${buttonSpace}px` }"
            tag="div"
          >
            <slot name="second-row-buttons"></slot>
          </transition-group>

          <transition-group
            class="no-wrap row children-clickable"
            :class="{ reverse: reverseOrder }"
            name="float-toolbar-transition"
            tag="div"
          >
            <slot></slot>
          </transition-group>

          <transition-group
            v-if="secondRowPosition === 'bottom'"
            class="no-wrap row children-clickable"
            :class="{ reverse: reverseOrder }"
            name="float-toolbar-transition"
            :style="{ 'min-height': `${buttonSpace}px` }"
            tag="div"
          >
            <slot name="second-row-buttons"></slot>
          </transition-group>
        </div>
      </q-fab>

      <transition-group
        v-if="!reverseOrder"
        class="fixed-buttons z-top row"
        name="float-toolbar-transition"
        :style="{ transform: `translateX(${fixedButtonsPosition}px)` }"
        tag="div"
      >
        <slot name="fixed-buttons"></slot>
      </transition-group>
    </div>
  </q-page-sticky>
</template>

<style lang="scss">
.fixed-buttons {
  transition: transform 0.18s ease-in;

  .q-btn {
    margin: 0 5px;
  }
}

.q-fab__actions--opened .children-clickable > * {
  pointer-events: auto;
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
