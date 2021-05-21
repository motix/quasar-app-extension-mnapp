import _ from 'lodash'

declare module '../use-formats' {
  interface FormatsInstance {
    percent (value: number | string | null | undefined, decimal?: number): string | null | undefined;
  }
}

export default function (value: number | string | null | undefined, decimal?: number) {
  if (value == null) return value

  if (_.isNumber(value)) return (value * 100).toFixed(decimal || 0) + '%'

  return _.toString(value)
}
