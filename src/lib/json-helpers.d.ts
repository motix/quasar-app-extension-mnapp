import type { SharedAPI } from '@quasar/app-vite';

export declare function reduceJsonFile(api: SharedAPI, file: string, paths: string[]): void;

export declare function reduceJsonFileArray(
  api: SharedAPI,
  file: string,
  pathAndValues: { path: string; value: unknown }[],
): void;
