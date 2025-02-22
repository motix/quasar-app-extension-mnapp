<script setup lang="ts">
import { useField } from 'vee-validate';

import { computed, watch } from 'vue';

import { date, Platform } from 'quasar';

import { requiredConfigEntries } from 'composables/useConfig';

// Props

type Props = {
  name: string;
};
const { name } = defineProps<Props>();

// Models

const model = defineModel<string[] | null>({ required: true });

// Composables

const { editDateFormat } = requiredConfigEntries('editDateFormat');

const { value: valValue, errorMessage } = useField<string[] | null>(name);

// Computed

const value = computed<string[] | null>({
  get() {
    return model.value;
  },
  set(value) {
    value?.sort(
      (a, b) =>
        date.extractDate(a, editDateFormat).valueOf() -
        date.extractDate(b, editDateFormat).valueOf(),
    );

    if (value?.join('|') !== valValue.value?.join('|')) {
      valValue.value = value;
      model.value = value;
    } else {
      valValue.value = value;
    }
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
