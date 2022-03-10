import percent from './formats/percent'
import currency from './formats/currency'
import date from './formats/date'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FormatsInstance { } // To be augmented

export default function () {
  const formats: FormatsInstance = {
    percent,
    currency,
    ...date()
  }

  return formats
}
