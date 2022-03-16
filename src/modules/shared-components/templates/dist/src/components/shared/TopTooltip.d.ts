declare module 'components/shared/TopTooltip.vue' {
  import type { ComponentConstructor, QTooltipProps } from 'quasar'
  import type { ComponentPublicInstance } from 'vue'

  interface QTooltip extends ComponentPublicInstance<QTooltipProps> {
    hide: () => void;
  }

  type Component = ComponentConstructor<QTooltip>
  const component: Component

  export default component
}
