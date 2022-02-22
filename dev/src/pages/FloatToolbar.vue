<script setup lang="ts">
import { useFloatToolbarResult } from 'composables/use-float-toolbar'

// Composables

const {
  collapseHeaderHeight,
  headerElevated,
  floatToolbarOffsetTop,
  floatToolbarOffsetBottom
} = useFloatToolbarResult()
</script>

<template>
  <div>
    <div
      class="bg-primary"
      :class="{'shadow-4': !headerElevated}"
      :style="{'min-height': collapseHeaderHeight + 'px'}"
    />
    <q-page padding>
      <div style="padding: 100px 0" />
      <div>headerElevated: {{ headerElevated }}</div>
      <div>floatToolbarOffsetTop: {{ floatToolbarOffsetTop }}</div>
      <div>floatToolbarOffsetBottom: {{ floatToolbarOffsetBottom }}</div>
      <div style="padding: 400px 0" />
      <div>
        End
      </div>
    </q-page>
  </div>
</template>
