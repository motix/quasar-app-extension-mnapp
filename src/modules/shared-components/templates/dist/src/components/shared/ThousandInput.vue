<script setup lang="ts">
import { isFinite } from 'lodash';

import { computed } from 'vue';

// Private

function oneThousandRound(value: number) {
  return Math.round(value / 1000) * 1000;
}

// Props

type Props = {
  modelValue: string | number | null | undefined;
  suffix?: string;
};
const props = defineProps<Props>();

// Emit

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void;
}>();

// Computed

const isValueValid = computed(() => {
  const valueAsNumber = parseInt(String(props.modelValue));

  return (
    isFinite(props.modelValue) &&
    (valueAsNumber === props.modelValue ||
      `${String(valueAsNumber)}E0` === props.modelValue ||
      `${String(valueAsNumber)}e0` === props.modelValue)
  );
});

const isThousandValue = computed(() => {
  const valueAsNumber = parseInt(String(props.modelValue));

  return (
    isFinite(props.modelValue) &&
    valueAsNumber === props.modelValue &&
    oneThousandRound(valueAsNumber) === valueAsNumber
  );
});

const displayValue = computed(() =>
  isValueValid.value
    ? isThousandValue.value
      ? (oneThousandRound(props.modelValue as number) / 1000).toString()
      : `${props.modelValue}E0`
    : props.modelValue?.toString() || '',
);

const suffix = computed(() =>
  isThousandValue.value && (props.modelValue as number) > 0
    ? '000' + (props.suffix || '')
    : props.suffix,
);

// Methods

function onUpdate(value: string | null) {
  let newValue: string | number | null = null;

  if (value != null) {
    const valueAsNumber = parseInt(value);

    newValue =
      isFinite(valueAsNumber) && String(valueAsNumber) === value
        ? valueAsNumber * 1000
        : isFinite(valueAsNumber) &&
          (`${String(valueAsNumber)}E0` === value || `${String(valueAsNumber)}e0` === value)
        ? valueAsNumber
        : value;
  }

  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue);
  }
}
</script>

<template>
  <q-input
    v-bind="$attrs"
    :model-value="displayValue"
    :suffix="suffix"
    @update:model-value="onUpdate($event as string | null)"
  >
    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
  </q-input>
</template>
