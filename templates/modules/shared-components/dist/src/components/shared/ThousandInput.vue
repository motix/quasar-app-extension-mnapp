<script setup lang="ts">
import { isFinite } from 'lodash-es';

import { computed } from 'vue';

// Private

function oneThousandRound(value: number) {
  return Math.round(value / 1000) * 1000;
}

// Props

type Props = {
  modelValue: string | number | null | undefined;
  suffix?: string | undefined;
};
const { modelValue, suffix } = defineProps<Props>();

// Emit

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void;
}>();

// Computed

const isValueValid = computed(() => {
  const valueAsNumber = parseInt(String(modelValue));

  return (
    isFinite(modelValue) &&
    (valueAsNumber === modelValue ||
      `${String(valueAsNumber)}E0` === modelValue ||
      `${String(valueAsNumber)}e0` === modelValue)
  );
});

const isThousandValue = computed(() => {
  const valueAsNumber = parseInt(String(modelValue));

  return (
    isFinite(modelValue) &&
    valueAsNumber === modelValue &&
    oneThousandRound(valueAsNumber) === valueAsNumber
  );
});

const displayValue = computed(() =>
  isValueValid.value
    ? isThousandValue.value
      ? (oneThousandRound(modelValue as number) / 1000).toString()
      : `${modelValue}E0`
    : modelValue?.toString() || '',
);

const thousandSuffix = computed(() =>
  isThousandValue.value && (modelValue as number) > 0 ? '000' + (suffix || '') : suffix,
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

  if (newValue !== modelValue) {
    emit('update:modelValue', newValue);
  }
}
</script>

<template>
  <q-input
    v-bind="$attrs"
    :model-value="displayValue"
    :suffix="thousandSuffix"
    @update:model-value="onUpdate($event as string | null)"
  >
    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
  </q-input>
</template>
