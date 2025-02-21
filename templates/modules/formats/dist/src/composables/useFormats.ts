import currency from './formats/currency';
import date from './formats/date';
import editor from './formats/editor';
import percent from './formats/percent';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FormatsInstance {} // To be augmented

export default function useFormats() {
  const formats: FormatsInstance = {
    percent,
    currency,
    ...date(),
    ...editor(),
  };

  return formats;
}
