declare module 'components/shared/validation/QInputVal.vue' {
  import type { ComponentPublicInstance } from 'vue'
  import type { ComponentConstructor, QInputProps } from 'quasar'

  type Props = { name: string; modelValue: string | number | null | undefined }
  type Component = ComponentConstructor<ComponentPublicInstance<Omit<QInputProps, keyof Props> & Props>>
  const component: Component

  export default component
}
