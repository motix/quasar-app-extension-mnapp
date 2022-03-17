<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, watch } from 'vue'

// Props

type Props = { name: string; modelValue: string | null | undefined }
const props = defineProps<Props>()

// Composables

const { value } = useField<string | null | undefined>(props.name)

// Watch

// Update validation value when v-model set from container changed
watch(computed(() => props.modelValue), newValue => {
  if (value.value !== newValue) {
    value.value = newValue
  }
})
</script>

<template>
  <q-date
    v-model="value"
    v-bind="$attrs"
  />
</template>
