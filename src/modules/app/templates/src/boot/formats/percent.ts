/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash'

declare module '../formats' {
  interface FormatsInstance {
    percent (value: any, decimal?: number): string;
  }
}

export default function (value: any, decimal?: number) {
  if (value === null || value === undefined) return value

  if (_.isNumber(value)) return (value * 100).toFixed(decimal || 0) + '%'

  return String(value)
}
