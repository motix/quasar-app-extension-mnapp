<script setup lang="ts">
import type { QDateProps } from 'quasar';

import { useField } from 'vee-validate';

import { computed, useTemplateRef, watch } from 'vue';

import { QPopupProxy } from 'quasar';

import { requiredConfigEntries } from 'composables/useConfig';

// Props

type Props = {
  name: string;
  optional?: boolean | undefined;
  dateOptions?: QDateProps['options'] | undefined;
};
const { name, optional, dateOptions } = defineProps<Props>();

// Models

const model = defineModel<string | null>();

// Composables

const { dateFormat, editDateFormat, dateMask } = requiredConfigEntries(
  'dateFormat',
  'editDateFormat',
  'dateMask',
);

const { value: valValue, errorMessage } = useField<string | null | undefined>(name);

// Data

const popupProxy = useTemplateRef('popupProxy');

// Computed

const value = computed<string | null | undefined>({
  get() {
    return model.value;
  },
  set(value) {
    valValue.value = value;
    model.value = value;
  },
});

// Private Executions

// Update validation value when v-model set from container changed
// after useForm is called and before this component is mounted
if (valValue.value !== model.value) {
  value.value = model.value;
}

// Watch

// Update validation value when v-model set from container changed
watch(model, (newValue) => {
  if (valValue.value !== newValue) {
    value.value = newValue;
  }
});
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
        <q-popup-proxy ref="popupProxy" cover transition-hide="scale" transition-show="scale">
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
