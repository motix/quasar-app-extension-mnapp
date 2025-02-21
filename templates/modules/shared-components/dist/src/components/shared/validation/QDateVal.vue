<script setup lang="ts">
import { useField } from 'vee-validate';

import { computed, watch } from 'vue';

// Props

type Props = {
  name: string;
  modelValue: string | null | undefined;
};
const props = defineProps<Props>();

// Composables

const { value } = useField<string | null | undefined>(props.name);

// Private Executions

// Update validation value when v-model set from container changed
if (value.value !== props.modelValue) {
  // Wrapping in a computed to avoid vue/no-setup-props-destructure rule
  value.value = computed(() => props.modelValue).value;
}

// Watch

// Update validation value when v-model set from container changed
// after useForm is called and before this component is mounted
watch(
  computed(() => props.modelValue),
  (newValue) => {
    if (value.value !== newValue) {
      value.value = newValue;
    }
  },
);
</script>

<template>
  <q-date v-model="value" v-bind="$attrs" />
</template>
