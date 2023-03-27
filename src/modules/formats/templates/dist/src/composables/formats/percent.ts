import { isFinite } from 'lodash';

declare module '../useFormats' {
  interface FormatsInstance {
    percent: typeof percent;
  }
}

export default function percent(
  value: number | string | null | undefined,
  decimal?: number
) {
  if (value == null) return value;

  if (isFinite(value)) {
    let valueAsNumber = value as number;

    // Fixing floating point issue
    if (decimal === undefined) {
      if (valueAsNumber * 100 * 100 !== valueAsNumber * 10000) {
        valueAsNumber = (valueAsNumber * 10000) / 100;
      } else {
        valueAsNumber = valueAsNumber * 100;
      }

      return `${valueAsNumber}%`;
    }

    return `${(valueAsNumber * 100).toFixed(decimal)}%`;
  }

  return String(value);
}
