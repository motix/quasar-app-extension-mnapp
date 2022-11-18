/* eslint-disable @typescript-eslint/no-explicit-any */

export {};

import type { ComponentConstructor } from 'quasar';
import { ComponentPublicInstance } from 'vue';

import { VueApexChartsComponent } from 'vue3-apexcharts';

type Method = (...args: any) => any;

type PropKeys = Exclude<
  keyof {
    [P in keyof VueApexChartsComponent as VueApexChartsComponent[P] extends Method
      ? never
      : P]: any;
  },
  keyof ComponentPublicInstance
>;

type Props = Pick<VueApexChartsComponent, PropKeys>;

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ApexCharts: ComponentConstructor<ComponentPublicInstance<Props>>;
  }
}
