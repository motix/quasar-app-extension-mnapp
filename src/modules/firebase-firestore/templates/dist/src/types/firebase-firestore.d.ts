export {};

declare module 'composables/useConfig' {
  interface Config {
    docsPageSize?: number;
    releaseDocsTimeout?: number;
  }
}
