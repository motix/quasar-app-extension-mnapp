export {};

import type { DateDataConverter } from 'utils/automapper';

declare module 'composables/useConfig' {
  interface Config {
    dateDataConverter?: DateDataConverter;
  }
}
