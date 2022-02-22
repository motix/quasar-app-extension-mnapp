export { }

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle?: string;
  }
}

declare module 'services/useConfig' {
  interface Config {
    appName?: string;
  }
}
