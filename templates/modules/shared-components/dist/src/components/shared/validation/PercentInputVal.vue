<script setup lang="ts">
import { useField } from 'vee-validate';

// Props

type Props = {
  name: string;
  decimal?: number | undefined;
};
const { name, decimal } = defineProps<Props>();

// Model

defineModel<string | number | null>();

// Composables

const { errorMessage, value } = useField<string | number | null | undefined>(name, undefined, {
  syncVModel: true,
});
</script>

<template>
  <percent-input
    v-model="value"
    :decimal="decimal"
    :error="!!errorMessage"
    :error-message="errorMessage"
  >
    <template #append>
      <slot name="append"></slot>
    </template>
  </percent-input>
</template>
