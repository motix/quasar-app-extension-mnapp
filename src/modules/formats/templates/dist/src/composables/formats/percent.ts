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

  if (isFinite(value))
    return ((value as number) * 100).toFixed(decimal || 0) + '%';

  return String(value);
}
