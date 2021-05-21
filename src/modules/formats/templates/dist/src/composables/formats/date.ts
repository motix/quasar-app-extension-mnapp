import _ from 'lodash'
import { date } from 'quasar'
import useConfig from 'composables/use-config'

declare module 'composables/use-config' {
  interface Config {
    dateFormat?: string;
    editDateFormat?: string;
    dateMask?: string;
  }
}

declare module '../use-formats' {
  interface FormatsInstance {
    date (value: Date | null | undefined): string | null | undefined;
    dateForEdit (value: Date | null | undefined): string | null | undefined;
    dateEdit (value: string | null | undefined, defaultDisplay?: string): string | null | undefined;
    dateForSave (value: string | null | undefined): string | null | undefined;
  }
}

export default function () {
  const config = useConfig()

  if (config.dateFormat === undefined) config.dateFormat = 'DD/MM/YYYY'
  if (config.editDateFormat === undefined) config.editDateFormat = 'DDMMYYYY'
  if (config.dateMask === undefined) config.dateMask = '##/##/####'

  function dateFormat (value: Date | null | undefined) {
    if (value === null || value === undefined) return value

    if (value instanceof Date) return date.formatDate(value, config.dateFormat as string)

    return _.toString(value)
  }

  function dateForEdit (value: Date | null | undefined) {
    if (value === null || value === undefined) return value

    if (value instanceof Date) return date.formatDate(value, config.editDateFormat as string)

    return _.toString(value)
  }

  function dateEdit (value: string | null | undefined, defaultDisplay?: string) {
    if (value === null || value === undefined || value === '') return defaultDisplay

    if (_.isString(value)) return dateFormat(date.extractDate(value, config.editDateFormat as string))

    return _.toString(value)
  }

  function dateForSave (value: string | null | undefined) {
    if (value === null || value === undefined) return value

    if (_.isString(value)) return date.formatDate(date.extractDate(value, config.editDateFormat as string), 'YYYY-MM-DD')

    return _.toString(value)
  }

  return {
    date: dateFormat,
    dateForEdit,
    dateEdit,
    dateForSave
  }
}
