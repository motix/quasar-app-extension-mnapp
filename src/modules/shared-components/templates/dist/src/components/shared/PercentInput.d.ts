declare module 'components/shared/PercentInput.vue' {
  import type { ComponentConstructor, QInputProps } from 'quasar'
  import type { ComponentPublicInstance } from 'vue'

  type Props = { modelValue: string | number | null | undefined }
  type Component = ComponentConstructor<ComponentPublicInstance<Omit<QInputProps, keyof Props> & Props>>
  const component: Component

  export default component
}
