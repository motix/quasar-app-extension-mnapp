<template>
  <q-page padding>
    <switch-view-button />

    <q-card v-if="isTableView">
      <q-card-section>
        Table View
        <div style="padding-bottom: 2000px" />
      </q-card-section>
    </q-card>

    <q-card v-if="isCardsView">
      <q-card-section>
        Cards View
        <div style="padding-bottom: 2000px" />
      </q-card-section>
    </q-card>

    <switch-view-button />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useMultiViews from 'composables/use-multi-views'
import SwitchViewButton from 'components/shared/SwitchViewButton.vue'

export default defineComponent({
  name: 'MultiViews',

  components: { SwitchViewButton },

  setup () {
    return {
      ...useMultiViews()
    }
  }
})
</script>
