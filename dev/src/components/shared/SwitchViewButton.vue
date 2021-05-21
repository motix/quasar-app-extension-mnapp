<template>
  <q-btn
    color="grey-3"
    :icon="`fal fa-${isTableView ? 'address-card' : 'table'}`"
    round
    text-color="primary"
    @click="switchViewAndScroll"
  >
    <top-tooltip>
      {{ isTableView ? 'Switch to Cards View' : 'Switch to Table View' }}
    </top-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useMultiViews from 'composables/use-multi-views'

export default defineComponent({
  name: 'SwitchViewButton',

  setup () {
    return { ...useMultiViews() }
  }
})
</script>
