<script setup lang="ts">
import useNotifications from 'composables/useNotifications';

// Composables

const { notifyLoadDataError, notifyCreateDataSuccessAndRedirect } =
  useNotifications();
</script>

<template>
  <q-page padding>
    <q-btn label="Load Data Error" @click="notifyLoadDataError" />
    <q-btn label="Create Success" @click="notifyCreateDataSuccessAndRedirect" />
  </q-page>
</template>
