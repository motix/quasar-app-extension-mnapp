<template>
  <q-page padding>
    <div>
      percent: {{ percentData }} -&gt; {{ f.percent(percentData) }}
    </div>
    <div>
      currency: {{ currencyData }} -&gt; {{ f.currency(currencyData) }}
    </div>
    <div>
      date: {{ dateData }} -&gt; {{ f.date(dateData) }}
    </div>
    <div>
      dateForEdit: {{ dateData }} -&gt; {{ f.dateForEdit(dateData) }}
    </div>
    <div>
      dateEdit: {{ dateEditData }} -&gt; {{ f.dateEdit(dateEditData) }}
    </div>
    <div>
      dateForSave: {{ dateEditData }} -&gt; {{ f.dateForSave(dateEditData) }}
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import useFormats from 'composables/use-formats'

export default defineComponent({
  name: 'Formats',

  setup () {
    const f = useFormats()
    const percentData = ref<number>(0.5)
    const currencyData = ref<number>(1000000)
    const dateData = ref<Date>(new Date())
    const dateEditData = ref<string>(f.dateForEdit(new Date()) as string)

    return {
      f,
      percentData,
      currencyData,
      dateData,
      dateEditData
    }
  }
})
</script>
