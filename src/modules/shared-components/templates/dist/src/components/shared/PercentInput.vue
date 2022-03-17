<script setup lang="ts">
import { isFinite } from 'lodash'
import { computed } from 'vue'

// Private

function percentRound (value: number) {
  return Math.round(value * 10000) / 10000
}

// Props

type Props = { modelValue: string | number | null | undefined }
const props = defineProps<Props>()

// Emit

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void;
}>()

// Computed

const displayValue = computed(() => isFinite(props.modelValue)
  ? percentRound(props.modelValue as number * 100).toString()
  : (props.modelValue?.toString() || '')
)

// Methods

function onUpdate (value: string | null) {
  let roundedValue: string | number | null = null

  if (value != null) {
    const valueAsNumber = parseFloat(value)
    roundedValue = (isFinite(valueAsNumber) && String(valueAsNumber) === value)
      ? percentRound(valueAsNumber / 100)
      : value
  }

  if (roundedValue !== props.modelValue) emit('update:modelValue', roundedValue)
}
</script>

<template>
  <q-input
    v-bind="$attrs"
    :model-value="displayValue"
    @update:model-value="onUpdate($event as string | null)"
  >
    <template
      v-if="$slots.loading"
      #loading
    >
      <slot name="loading" />
    </template>
  </q-input>
</template>
