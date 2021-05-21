<template>
  <q-page-sticky
    :offset="[offsetX, offsetY]"
    position="top-right"
    style="z-index: 2500; margin-left: 0; margin-bottom: 0"
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

<script lang="ts" src="./FloatToolbar" />

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
