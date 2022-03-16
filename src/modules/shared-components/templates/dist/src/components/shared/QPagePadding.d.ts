declare module 'components/shared/QPagePadding.vue' {
  import type { ComponentConstructor, QPageProps } from 'quasar'
  import type { ComponentPublicInstance } from 'vue'

  type Props = {
    fixedPadding?: number;
    topFloatPadding?: number;
    bottomFloatPadding?: number;
  }
  type Component = ComponentConstructor<ComponentPublicInstance<Omit<QPageProps, keyof Props> & Props>>
  const component: Component

  export default component
}
