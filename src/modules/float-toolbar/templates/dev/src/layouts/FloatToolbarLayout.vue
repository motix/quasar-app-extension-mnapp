<script setup lang="ts">
import { ref } from 'vue';

import useFloatToolbar from 'composables/useFloatToolbar';

// Composables

const { headerElevated, onScroll, onReveal } = useFloatToolbar(50, 50);

const leftDrawerOpen = ref(false);

// Methods

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
  <q-layout view="lHh Lpr lFf" @scroll="onScroll">
    <q-header :elevated="headerElevated" reveal @reveal="onReveal">
      <q-toolbar>
        <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleLeftDrawer" />

        <q-toolbar-title> mnapp Dev - elevated: {{ headerElevated }} </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-grey-1" show-if-above>
      <q-list>
        <q-item-label class="text-grey-8" header> Essential Links </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
