<script setup lang="ts">
import { isFinite } from 'lodash';

import { computed } from 'vue';

// Private

function percentRound(value: number) {
  return props.decimal
    ? Math.round(value * Math.pow(10, 2 + props.decimal)) /
        Math.pow(10, 2 + props.decimal)
    : value;
}

// Without this, 110% will display as 110.00000000000001%
function percentDisplayRound(value: number) {
  return Math.round(value * 10000000000000) / 10000000000000;
}

// Props

type Props = {
  modelValue: string | number | null | undefined;
  decimal?: number;
};
const props = defineProps<Props>();

// Emit

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void;
}>();

// Computed

const isValueValid = computed(() => {
  const valueAsNumber = parseFloat(String(props.modelValue));

  return isFinite(props.modelValue) && valueAsNumber === props.modelValue;
});

const displayValue = computed(() =>
  isValueValid.value
    ? percentDisplayRound(
        percentRound(props.modelValue as number) * 100
      ).toString()
    : props.modelValue?.toString() || ''
);

// Methods

function onUpdate(value: string | null) {
  let roundedValue: string | number | null = null;

  if (value != null) {
    const valueAsNumber = parseFloat(value);
    roundedValue =
      isFinite(valueAsNumber) && String(valueAsNumber) === value
        ? percentRound(valueAsNumber / 100)
        : value;
  }

  if (roundedValue !== props.modelValue) {
    emit('update:modelValue', roundedValue);
  }
}
</script>

<template>
  <q-input
    v-bind="$attrs"
    class="percent"
    :model-value="displayValue"
    :suffix="isValueValid ? '%' : undefined"
    @update:model-value="onUpdate($event as string | null)"
  >
    <template v-if="$slots.loading" #loading>
      <slot name="loading"></slot>
    </template>
  </q-input>
</template>

<style scoped lang="scss">
.percent :deep() .q-field__suffix {
  padding-left: 0;
}
</style>
