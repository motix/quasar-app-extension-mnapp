<template>
  <q-page padding>
    <div>
      <q-input
        ref="validDateInput"
        v-model="validDateModel"
        fill-mask
        filled
        hint="DD/MM/YYYY"
        label="Date Field"
        mask="##/##/####"
        :rules="[val => validDate(val) || 'Invalid date']"
        unmasked-value
      />

      <q-input
        ref="sameDateOrAfterInput"
        v-model="sameDateOrAfterModel"
        class="q-mt-sm"
        fill-mask
        filled
        hint="DD/MM/YYYY"
        label="Same Date Field or After"
        mask="##/##/####"
        :rules="[val => sameDateOrAfter(val, validDateModel) || 'Must be same or after Date Field']"
        unmasked-value
      />

      <q-btn
        class="q-mt-sm"
        color="primary"
        label="Reset Validation"
        @click="reset"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { QInput } from 'quasar'
import useRules from 'composables/use-rules'

export default defineComponent({
  name: 'Rules',

  setup () {
    const rules = useRules()
    const validDateInput = ref<QInput>()
    const sameDateOrAfterInput = ref<QInput>()
    const validDateModel = ref<string>('')
    const sameDateOrAfterModel = ref<string>('')

    function reset () {
      (validDateInput.value as QInput).resetValidation();
      (sameDateOrAfterInput.value as QInput).resetValidation()
    }

    return {
      ...rules,
      validDateInput,
      sameDateOrAfterInput,
      validDateModel,
      sameDateOrAfterModel,
      reset
    }
  }
})
</script>
