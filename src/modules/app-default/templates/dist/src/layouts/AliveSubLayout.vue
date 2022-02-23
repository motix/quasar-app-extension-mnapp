<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

// Data

// Transition 'out-in' mode, KeepAlive and an outer transition don't live well together.
// This hack unloads any cached component before the transition.
// The div is required as the transition element for the whole component.
const keepAlive = ref(true)

// Lifecycle Hooks

onBeforeUnmount(() => {
  keepAlive.value = false
})

</script>
<template>
  <router-view v-slot="{ Component }">
    <div>
      <fade-transition>
        <keep-alive :include="keepAlive ? 'AliveIndex' : '_'">
          <component :is="Component" />
        </keep-alive>
      </fade-transition>
    </div>
  </router-view>
</template>
