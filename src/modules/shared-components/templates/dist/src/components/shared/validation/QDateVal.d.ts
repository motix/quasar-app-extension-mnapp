declare module 'components/shared/validation/QDateVal.vue' {
  import type { ComponentConstructor, QDateProps } from 'quasar'
  import type { ComponentPublicInstance } from 'vue'

  type Props = { name: string; modelValue: string | null | undefined }
  type Component = ComponentConstructor<ComponentPublicInstance<Omit<QDateProps, keyof Props> & Props>>
  const component: Component

  export default component
}
