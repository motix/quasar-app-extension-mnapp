export { }

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FadeTransition: typeof import('components/shared/transitions/FadeTransition.vue')
    ListTransition: typeof import('components/shared/transitions/ListTransition.vue')

    TopTooltip: typeof import('components/shared/TopTooltip.vue')

    Gravatar: typeof import('components/shared/Gravatar.vue')

    ExpandableCard: typeof import('components/shared/expandable-card/ExpandableCard.vue')

    PercentInput: typeof import('components/shared/PercentInput.vue')
  }
}

declare module 'composables/use-config' {
  interface Config {
    cardWidth?: number;
    listItemCardWidth?: number;
  }
}
