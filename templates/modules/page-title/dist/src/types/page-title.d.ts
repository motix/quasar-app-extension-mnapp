export {};

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle?: string;
  }
}

declare module 'composables/useConfig' {
  interface Config {
    appName?: string;
  }
}
