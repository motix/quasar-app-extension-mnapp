<script setup lang="ts">
import useMultiViews from 'composables/useMultiViews';

// Composables

const { isTableView, switchViewAndScroll } = useMultiViews();
</script>

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
