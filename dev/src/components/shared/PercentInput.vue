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

<script lang="ts">
import _ from 'lodash'
import {
  defineComponent, computed
} from 'vue'

export default defineComponent({
  name: 'PercentInput',

  props: {
    modelValue: {
      type: [String, Number],
      required: false,
      default: undefined
    }
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    function percentRound (value: number) {
      return Math.round(value * 10000) / 10000
    }

    const displayValue =
      computed(() => _.isNumber(props.modelValue) ? _.toString(percentRound(props.modelValue * 100)) : _.toString(props.modelValue))

    const onUpdate = (value: string) => {
      const valueAsNumber = parseFloat(value)
      const roundedValue = (_.isNumber(valueAsNumber) && _.toString(valueAsNumber) === value)
        ? percentRound(valueAsNumber / 100)
        : value
      if (roundedValue !== props.modelValue) emit('update:modelValue', roundedValue)
    }

    return { displayValue, onUpdate }
  }
})
</script>
