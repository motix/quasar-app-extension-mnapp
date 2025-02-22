<script setup lang="ts">
import { useField } from 'vee-validate';

import { watch } from 'vue';

// Props

type Props = {
  name: string;
};
const { name } = defineProps<Props>();

// Models

const model = defineModel<string | number | null>();

// Composables

const { errorMessage, value } = useField<string | number | null | undefined>(name);

// Private Executions

// Update validation value when v-model set from container changed
// after useForm is called and before this component is mounted
if (value.value !== model.value) {
  value.value = model.value;
}

// Watch

// Update validation value when v-model set from container changed
watch(model, (newValue) => {
  if (value.value !== newValue) {
    value.value = newValue;
  }
});
</script>

<template>
  <thousand-input
    v-bind="$attrs"
    v-model="value"
    :error="!!errorMessage"
    :error-message="errorMessage"
  >
    <template #append>
      <slot name="append"></slot>
    </template>
  </thousand-input>
</template>
