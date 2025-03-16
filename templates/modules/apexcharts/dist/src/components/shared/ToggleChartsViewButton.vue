<script setup lang="ts">
import { Dark } from 'quasar';

import useCharts from 'composables/useCharts.js';
import useMultiViews from 'composables/useMultiViews.js';

// Composables

const { isTableView } = useMultiViews();
const { isChartsView } = useCharts();
</script>

<template>
  <q-btn
    :color="Dark.isActive ? 'grey-9' : 'grey-3'"
    :icon="`fal fa-${isChartsView ? (isTableView ? 'table' : 'address-card') : 'analytics'}`"
    round
    text-color="primary"
    @click="isChartsView = !isChartsView"
  >
    <top-tooltip>
      {{
        isChartsView
          ? isTableView
            ? 'Switch to Table View'
            : 'Switch to Cards View'
          : 'Switch to Chart View'
      }}
    </top-tooltip>
  </q-btn>
</template>
