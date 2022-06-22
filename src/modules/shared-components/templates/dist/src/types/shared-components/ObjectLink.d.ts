declare module 'components/shared/ObjectLink.vue' {
  import type { ComponentPublicInstance } from 'vue';
  import type { ComponentConstructor, QBtnProps } from 'quasar';

  type Props = { label: string; wrapLabel?: boolean; maxWidth?: string };
  type Component = ComponentConstructor<
    ComponentPublicInstance<Omit<QBtnProps, keyof Props> & Props>
  >;
  const component: Component;

  export default component;
}
