export { }

declare module 'vue-router' {
  interface RouteMeta {
    mainTransitionKey?: string;
    isTransitionParent?: boolean;
    transitionEnter?: 'animated slideInLeft' | 'animated slideInRight';
    transitionLeave?: 'animated slideOutLeft' | 'animated slideOutRight';
  }
}
