import _ from 'lodash'

declare module '../useFormats' {
  interface FormatsInstance {
    percent: typeof percent;
  }
}

export default function percent (value: number | string | null | undefined, decimal?: number) {
  if (value == null) return value

  if (_.isNumber(value)) return (value * 100).toFixed(decimal || 0) + '%'

  return _.toString(value)
}
