<script setup lang="ts">
import { useField } from 'vee-validate';

import { computed, watch } from 'vue';

// Props

type Props = {
  name: string;
  modelValue: string | number | null | undefined;
  decimal?: number | undefined;
};
const { name, modelValue, decimal } = defineProps<Props>();

// Composables

const { errorMessage, value } = useField<string | number | null | undefined>(name);

// Private Executions

// Update validation value when v-model set from container changed
if (value.value !== modelValue) {
  // Wrapping in a computed to avoid vue/no-setup-props-destructure rule
  value.value = computed(() => modelValue).value;
}

// Watch

// Update validation value when v-model set from container changed
watch(
  computed(() => modelValue),
  (newValue) => {
    if (value.value !== newValue) {
      value.value = newValue;
    }
  },
);
</script>

<template>
  <percent-input
    v-bind="$attrs"
    v-model="value"
    :decimal="decimal"
    :error="!!errorMessage"
    :error-message="errorMessage"
  >
    <template #append>
      <slot name="append" />
    </template>
  </percent-input>
</template>
