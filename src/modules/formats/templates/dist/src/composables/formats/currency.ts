import { isFinite } from 'lodash'

declare module '../useFormats' {
  interface FormatsInstance {
    currency: typeof currency;
  }
}

export default function currency (value: number | string | null | undefined) {
  if (value == null) return value

  if (isFinite(value)) {
    const negative = value < 0
    value = Math.abs(value as number)
    let result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    result = result.replace(/,/g, '_')
    result = result.replace(/\./g, ',')
    result = result.replace(/_/g, '.')

    return (negative ? '(' : '') + result + (negative ? ')' : '')
  }

  return String(value)
}
