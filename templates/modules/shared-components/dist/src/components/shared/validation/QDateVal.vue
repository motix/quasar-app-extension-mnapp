<script setup lang="ts">
import { useField } from 'vee-validate';

import { watch } from 'vue';

// Props

type Props = {
  name: string;
};
const { name } = defineProps<Props>();

// Models

const model = defineModel<string | null>();

// Composables

const { value } = useField<string | null | undefined>(name);

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
  <q-date v-model="value" v-bind="$attrs" />
</template>
