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

  return isFinite(props.modelValue) && valueAsNumber === props.modelValue;
});

const displayValue = computed(() =>
  isValueValid.value
    ? (oneThousandRound(props.modelValue as number) / 1000).toString()
    : props.modelValue?.toString() || ''
);

// Methods

function onUpdate(value: string | null) {
  let roundedValue: string | number | null = null;

  if (value != null) {
    const valueAsNumber = parseInt(value);
    roundedValue =
      isFinite(valueAsNumber) && String(valueAsNumber) === value
        ? valueAsNumber * 1000
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
    :model-value="displayValue"
    :suffix="isValueValid && (modelValue as number) > 0 ? ('000' + (props.suffix || '')) : props.suffix"
    @update:model-value="onUpdate($event as string | null)"
  >
    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
  </q-input>
</template>
