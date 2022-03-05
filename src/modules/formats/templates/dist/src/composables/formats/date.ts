import _ from 'lodash'
import { date as qdate } from 'quasar'
import { requiredConfigEntries } from 'services/useConfig'

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

    if (value instanceof Date) return qdate.formatDate(value, dateFormat)

    return _.toString(value)
  }

  function dateViewModel (value: string | null | undefined, defaultDisplay?: string) {
    if (value == null || value === '') return defaultDisplay

    if (_.isString(value)) return formatDate(qdate.extractDate(value, editDateFormat))

    return _.toString(value)
  }

  return {
    date: formatDate,
    dateViewModel
  }
}
