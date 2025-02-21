export {};

declare module 'composables/useConfig' {
  interface Config {
    dateFormat?: string;
    timeFormat?: string;
    editDateFormat?: string;
    dateMask?: string;
    monthDayFormat?: string;
  }
}
