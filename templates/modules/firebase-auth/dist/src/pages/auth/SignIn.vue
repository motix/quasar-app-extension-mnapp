<script setup lang="ts">
import 'firebaseui/dist/firebaseui.css';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import useFirebaseAuth from 'composables/useFirebaseAuth';

// Composables

const { params: routeParams } = useRoute();
const { startAuthUi } = useFirebaseAuth();

// Data

const loading = ref<boolean>(true);

// Methods

function loaderEnter() {
  const transitionContainer = document.getElementById('sign-in-transition-container');
  const uiContainer = document.getElementById('firebaseui-auth-container');
  if (transitionContainer && uiContainer && uiContainer.childNodes.length > 0) {
    transitionContainer.appendChild(uiContainer.childNodes[0]!);
  }
}

// Lifecycle Hooks

onMounted(() => {
  startAuthUi(
    '#firebaseui-auth-container',
    () => {
      // The widget is rendered.
      // Hide the loader.
      loading.value = false;
    },
    routeParams.returnUrl as string | undefined,
  );
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <fade-transition @enter="loaderEnter">
      <div v-if="loading">
        <q-spinner-pie color="primary" size="6em" />
      </div>
      <div v-else id="sign-in-transition-container"></div>
    </fade-transition>
    <div v-show="false" id="firebaseui-auth-container"></div>
  </q-page>
</template>
