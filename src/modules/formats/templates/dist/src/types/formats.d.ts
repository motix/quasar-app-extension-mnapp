export {};

declare module 'composables/useConfig' {
  interface Config {
    dateFormat?: string;
    editDateFormat?: string;
    dateMask?: string;
    monthDayFormat?: string;
  }
}
