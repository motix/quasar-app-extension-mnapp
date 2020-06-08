/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash'

declare module '../formats' {
  interface FormatsInstance {
    currency (value: any): string;
  }
}

export default function (value: any) {
  if (value === null || value === undefined) return value

  if (_.isNumber(value)) {
    const negative = value < 0
    value = Math.abs(value)
    let result = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    result = result.replace(/,/g, '_')
    result = result.replace(/\./g, ',')
    result = result.replace(/_/g, '.')

    return (negative ? '(' : '') + result + (negative ? ')' : '')
  }

  return String(value)
}
