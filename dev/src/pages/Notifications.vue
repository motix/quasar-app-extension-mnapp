<template>
  <q-page padding>
    <q-btn
      label="Load Data Error"
      @click="notifyLoadDataError"
    />
    <q-btn
      label="Create Success"
      @click="notifyCreateDataSuccessAndRedirect"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useNotifications from 'composables/use-notifications'

export default defineComponent({
  name: 'Notifications',

  setup () {
    return {
      ...useNotifications()
    }
  }
})
</script>
