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
    if (decimal === undefined) {
      return `${(value as number) * 100}%`;
    }

    return `${((value as number) * 100).toFixed(decimal)}%`;
  }

  return String(value);
}
