<script setup lang="ts">
import { VueClassProp } from 'quasar';

// Props

type Props = { fieldClass?: VueClassProp };
defineProps<Props>();
</script>

<template>
  <q-field v-bind="$attrs" readonly>
    <template #control>
      <div
        class="self-center full-width no-outline"
        :class="fieldClass"
        tabindex="0"
      >
        <slot></slot>
      </div>
    </template>
  </q-field>
</template>
