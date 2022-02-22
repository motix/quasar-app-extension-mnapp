<script setup lang="ts">
import _ from 'lodash'
// Main
import { computed } from 'vue'

// Props

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: false,
    default: undefined
  }
})

// Emit

const emit = defineEmits(['update:modelValue'])

// Computed

const displayValue = computed(() => _.isNumber(props.modelValue)
  ? _.toString(percentRound(props.modelValue * 100))
  : _.toString(props.modelValue))

// Methods

function percentRound (value: number) {
  return Math.round(value * 10000) / 10000
}

function onUpdate (value: string) {
  const valueAsNumber = parseFloat(value)
  const roundedValue = (_.isNumber(valueAsNumber) && _.toString(valueAsNumber) === value)
    ? percentRound(valueAsNumber / 100)
    : value
  if (roundedValue !== props.modelValue) emit('update:modelValue', roundedValue)
}
</script>

<template>
  <q-input
    v-bind="$attrs"
    :model-value="displayValue"
    @update:model-value="onUpdate"
  >
    <template
      v-if="$slots.loading"
      #loading
    >
      <slot name="loading" />
    </template>
  </q-input>
</template>
