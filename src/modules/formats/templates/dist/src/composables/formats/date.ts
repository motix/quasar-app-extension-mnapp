import { date as qdate } from 'quasar';

import { requiredConfigEntries } from 'composables/useConfig';

declare module '../useFormats' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface FormatsInstance extends ReturnType<typeof date> {}
}

export default function date() {
  const { dateFormat, editDateFormat, monthDayFormat } = requiredConfigEntries(
    'dateFormat',
    'editDateFormat',
    'monthDayFormat'
  );

  function formatDate(value: Date | null | undefined) {
    if (value == null) return value;

    return qdate.formatDate(value, dateFormat);
  }

  function dateViewModel(
    value: string | null | undefined,
    defaultDisplay?: string
  ) {
    if (value == null || value === '') return defaultDisplay;

    return formatDate(qdate.extractDate(value, editDateFormat));
  }

  function yearMonth(year: number, month: number) {
    return `${year}-${month < 10 ? '0' : ''}${month}`;
  }

  function yearMonthViewModel(
    year: number | string | null | undefined,
    month: number | string | null | undefined,
    defaultYearDisplay?: string,
    defaultMonthDisplay?: string
  ) {
    return `${year == null || year === '' ? defaultYearDisplay : year}-${
      month == null || month === ''
        ? defaultMonthDisplay
        : `${month < 10 ? '0' : ''}${month}`
    }`;
  }

  function monthDay(month: number, day: number) {
    return qdate.formatDate(new Date(2000, month - 1, day), monthDayFormat);
  }

  function monthDayViewModel(
    month: number | string | null | undefined,
    day: number | string | null | undefined,
    defaultMonthDisplay?: string,
    defaultDayDisplay?: string
  ) {
    return `${
      month == null || month === ''
        ? defaultMonthDisplay
        : `${month < 10 ? '0' : ''}${month}`
    }-${
      day == null || day === ''
        ? defaultDayDisplay
        : `${day < 10 ? '0' : ''}${day}`
    }`;
  }

  return {
    date: formatDate,
    dateViewModel,
    yearMonth,
    yearMonthViewModel,
    monthDay,
    monthDayViewModel,
  };
}
