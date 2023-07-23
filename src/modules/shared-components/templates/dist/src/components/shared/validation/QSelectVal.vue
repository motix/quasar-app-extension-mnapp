<script setup lang="ts">
import { useField } from 'vee-validate';

import { computed, watch } from 'vue';

// Props

type Props = {
  name: string;
  modelValue: unknown;
};
const props = defineProps<Props>();

// Composables

const { errorMessage, value } = useField(props.name);

// Private Executions

// Update validation value when v-model set from container changed
// after useForm is called and before this component is mounted
if (value.value !== props.modelValue) {
  // Wrapping in a computed to avoid vue/no-setup-props-destructure rule
  value.value = computed(() => props.modelValue).value;
}

// Watch

// Update validation value when v-model set from container changed
watch(
  computed(() => props.modelValue),
  (newValue) => {
    if (value.value !== newValue) {
      value.value = newValue;
    }
  }
);
</script>

<template>
  <q-select
    v-bind="$attrs"
    v-model="value"
    :error="!!errorMessage"
    :error-message="errorMessage"
  />
</template>
