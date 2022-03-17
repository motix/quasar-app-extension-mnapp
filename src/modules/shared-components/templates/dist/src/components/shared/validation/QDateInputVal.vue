<script setup lang="ts">
import { useField } from 'vee-validate'
import { requiredConfigEntries } from 'composables/useConfig'
import { computed, ref, watch } from 'vue'

import type { QPopupProxy } from 'quasar'

// Props

type Props = {
  name: string;
  modelValue: string;
  optional?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  optional: false
})

// Emits

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>()

// Composables

const {
  dateFormat,
  editDateFormat,
  dateMask
} = requiredConfigEntries(
  'dateFormat',
  'editDateFormat',
  'dateMask'
)

const {
  value: valValue,
  errorMessage
} = useField<string | null | undefined>(props.name)

// Data

const popupProxy = ref<QPopupProxy | null>(null)

// Computed

const value = computed<string>({
  get () {
    return props.modelValue
  },
  set (value) {
    valValue.value = value
    emit('update:modelValue', value)
  }
})

// Watch

// Update validation value when v-model set from container changed
watch(computed(() => props.modelValue), newValue => {
  if (valValue.value !== newValue) {
    value.value = newValue
  }
})
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
      <q-icon
        class="cursor-pointer"
        name="fal fa-calendar-day"
      >
        <q-popup-proxy
          ref="popupProxy"
          cover
          transition-hide="scale"
          transition-show="scale"
        >
          <q-date
            v-model="value"
            :mask="editDateFormat"
            @update:model-value="popupProxy?.hide()"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
