export { }

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle?: string;
  }
}

declare module 'composables/use-config' {
  interface Config {
    appName?: string;
  }
}
