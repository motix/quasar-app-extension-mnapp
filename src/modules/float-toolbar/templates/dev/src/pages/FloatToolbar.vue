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
      <div>floatToolbarPosition: {{ floatToolbarPosition }}</div>
      <div style="padding: 400px 0" />
      <div>
        End
      </div>
    </q-page>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useFloatToolbarResult } from 'composables/use-float-toolbar'

export default defineComponent({
  name: 'FloatToolbar',

  setup () {
    return {
      ...useFloatToolbarResult()
    }
  }
})
</script>
