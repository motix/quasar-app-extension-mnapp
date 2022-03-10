import { date as qdate } from 'quasar'
import { requiredConfigEntries } from 'composables/useConfig'

declare module '../useFormats' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface FormatsInstance extends ReturnType<typeof date> { }
}

export default function date () {
  const {
    dateFormat,
    editDateFormat
  } = requiredConfigEntries(
    'dateFormat',
    'editDateFormat')

  function formatDate (value: Date | null | undefined) {
    if (value == null) return value

    return qdate.formatDate(value, dateFormat)
  }

  function dateViewModel (value: string | null | undefined, defaultDisplay?: string) {
    if (value == null || value === '') return defaultDisplay

    return formatDate(qdate.extractDate(value, editDateFormat))
  }

  return {
    date: formatDate,
    dateViewModel
  }
}
