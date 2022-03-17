<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, watch } from 'vue'

// Props

type Props = { name: string; modelValue: string | number | null | undefined }
const props = defineProps<Props>()

// Composables

const { errorMessage, value } = useField<string | number | null | undefined>(props.name)

// Watch

// Update validation value when v-model set from container changed
watch(computed(() => props.modelValue), newValue => {
  if (value.value !== newValue) {
    value.value = newValue
  }
})
</script>

<template>
  <q-input
    v-bind="$attrs"
    v-model="value"
    :error="!!errorMessage"
    :error-message="errorMessage"
  >
    <template #append>
      <slot name="append" />
    </template>
  </q-input>
</template>
