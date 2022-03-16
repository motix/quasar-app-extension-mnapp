declare module 'components/shared/validation/QSelectVal.vue' {
  import type { ComponentConstructor, QSelectProps } from 'quasar'
  import type { ComponentPublicInstance } from 'vue'

  type Props = { name: string; modelValue: unknown }
  type Component = ComponentConstructor<ComponentPublicInstance<Omit<QSelectProps, keyof Props> & Props>>
  const component: Component

  export default component
}
