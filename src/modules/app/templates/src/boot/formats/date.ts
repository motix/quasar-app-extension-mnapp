/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash'
import { date } from 'quasar'
import { ConfigInstance } from '../app/config'

declare module '../formats' {
  interface FormatsInstance {
    date (value: any): string;
    dateEdit (value: any, defaultDisplay?: string): string;
    dateSave (value: any): string;
  }
}

export default function (config: ConfigInstance) {
  function dateFormat (value: any) {
    if (value === null || value === undefined) return value

    if (value instanceof Date) return date.formatDate(value, config.dateFormat)

    return String(value)
  }

  function dateEdit (value: any, defaultDisplay?: string) {
    if (value === null || value === undefined || value === '') return defaultDisplay

    if (_.isString(value)) return dateFormat(date.extractDate(value, config.editDateFormat))

    return String(value)
  }

  function dateSave (value: any) {
    if (value === null || value === undefined) return value

    if (_.isString(value)) return date.formatDate(date.extractDate(value, config.editDateFormat), 'YYYY-MM-DD')

    return String(value)
  }

  return {
    date: dateFormat,
    dateEdit,
    dateSave
  }
}
