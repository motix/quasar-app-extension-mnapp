<script setup lang="ts">
import { useField } from 'vee-validate';

import { computed, watch } from 'vue';

import { date, Platform } from 'quasar';

import { requiredConfigEntries } from 'composables/useConfig';

// Props

type Props = { name: string; modelValue: string[] | null };
const props = defineProps<Props>();

// Emits

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[] | null): void;
}>();

// Composables

const { editDateFormat } = requiredConfigEntries('editDateFormat');

const { value: valValue, errorMessage } = useField<string[] | null>(props.name);

// Computed

const value = computed<string[] | null>({
  get() {
    return props.modelValue;
  },
  set(value) {
    value?.sort(
      (a, b) =>
        date.extractDate(a, editDateFormat).valueOf() -
        date.extractDate(b, editDateFormat).valueOf()
    );

    if (value?.join('|') !== valValue.value?.join('|')) {
      valValue.value = value;
      emit('update:modelValue', value);
    } else {
      valValue.value = value;
    }
  },
});

// Private Executions

// Update validation value when v-model set from container changed
if (valValue.value !== props.modelValue) {
  // Wrapping in a computed to avoid vue/no-setup-props-destructure rule
  value.value = computed(() => props.modelValue).value;
}

// Watch

// Update validation value when v-model set from container changed
// after useForm is called and before this component is mounted
watch(
  computed(() => props.modelValue),
  (newValue) => {
    if (valValue.value !== newValue) {
      value.value = newValue;
    }
  }
);
</script>

<template>
  <div>
    <q-field
      v-bind="$attrs"
      v-model="value"
      :error="!!errorMessage"
      :error-message="errorMessage"
      stack-label
    >
      <template #control>
        <q-date
          v-model="value"
          class="q-mt-sm full-width"
          :landscape="Platform.is.desktop"
          :mask="editDateFormat"
          multiple
        />
      </template>
    </q-field>
  </div>
</template>
