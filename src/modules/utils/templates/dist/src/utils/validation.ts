import { mixed, number, string } from 'yup'

import { date } from 'quasar'

import { requiredConfigEntries } from 'composables/useConfig'

const { editDateFormat } = requiredConfigEntries('editDateFormat')

export function stringRequired (label: string) {
  return string().required().label(label)
}

export function emailRequired (label: string) {
  return string().required().email().label(label)
}

export function numberRequired (label: string) {
  return number().required().label(label)
    .typeError(`${label} must be a number`)
    .transform((value: unknown, originalValue) => (originalValue === '' ? undefined : value))
}

export function numberOptional (label: string) {
  return number().nullable().default(null).label(label)
    .typeError(`${label} must be a number`)
    .transform((value: unknown, originalValue) => (originalValue === '' ? undefined : value))
}

export function integerRequired (label: string) {
  return numberRequired(label).integer()
}

export function integerOptional (label: string) {
  return numberOptional(label).integer()
}

export function percentRequiredMin (label: string) {
  return numberRequired(label)
    .min(0.01, `${label} must be at least 1%`)
}

export function percentRequiredMinMax (label: string) {
  return numberRequired(label)
    .min(0.01, `${label} must be between 1% and 100%`)
    .max(1, `${label} must be between 1% and 100%`)
}

export function dateRequired (label:string) {
  return stringRequired(label)
    .test({
      message: `${label} must be a date`,
      test: value =>
        !value ||
        value === date.formatDate(date.extractDate(value, editDateFormat), editDateFormat)
    })
}

export function dateOptional (label:string) {
  return string().notRequired().default('').label(label)
    .test({
      message: `${label} must be a date`,
      test: value =>
        !value ||
        value === date.formatDate(date.extractDate(value, editDateFormat), editDateFormat)
    })
}

export function asIsRequired (label: string) {
  return mixed().required().default(undefined).label(label)
}
