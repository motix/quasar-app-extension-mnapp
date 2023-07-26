<script setup lang="ts">
import { useField } from 'vee-validate';

import { computed, ref, watch } from 'vue';

import { QDateProps, QPopupProxy } from 'quasar';

import { requiredConfigEntries } from 'composables/useConfig';

// Props

type Props = {
  name: string;
  modelValue: string | null | undefined;
  optional?: boolean;
  dateOptions?: QDateProps['options'];
};
const props = withDefaults(defineProps<Props>(), {
  optional: false,
  dateOptions: undefined,
});

// Emits

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null | undefined): void;
}>();

// Composables

const { dateFormat, editDateFormat, dateMask } = requiredConfigEntries(
  'dateFormat',
  'editDateFormat',
  'dateMask',
);

const { value: valValue, errorMessage } = useField<string | null | undefined>(
  props.name,
);

// Data

const popupProxy = ref<QPopupProxy | null>(null);

// Computed

const value = computed<string | null | undefined>({
  get() {
    return props.modelValue;
  },
  set(value) {
    valValue.value = value;
    emit('update:modelValue', value);
  },
});

// Private Executions

// Update validation value when v-model set from container changed
// after useForm is called and before this component is mounted
if (valValue.value !== props.modelValue) {
  // Wrapping in a computed to avoid vue/no-setup-props-destructure rule
  value.value = computed(() => props.modelValue).value;
}

// Watch

// Update validation value when v-model set from container changed
watch(
  computed(() => props.modelValue),
  (newValue) => {
    if (valValue.value !== newValue) {
      value.value = newValue;
    }
  },
);
</script>

<template>
  <q-input
    v-bind="$attrs"
    v-model="value"
    :clearable="optional"
    :error="!!errorMessage"
    :error-message="errorMessage"
    :hint="dateFormat + (optional ? ' (optional)' : '')"
    :mask="dateMask"
    unmasked-value
  >
    <template #append>
      <q-icon class="cursor-pointer" name="fal fa-calendar-day">
        <q-popup-proxy
          ref="popupProxy"
          cover
          transition-hide="scale"
          transition-show="scale"
        >
          <q-date
            v-model="value"
            :mask="editDateFormat"
            :options="dateOptions"
            @update:model-value="popupProxy?.hide()"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
