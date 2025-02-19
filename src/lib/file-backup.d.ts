import type { SharedAPI } from '@quasar/app-vite';

export declare function backupFile(api: SharedAPI, relativePath: string): void;
export declare function backupAndDeleteFile(
  api: SharedAPI,
  relativePath: string,
): void;
export declare function restoreFile(api: SharedAPI, relativePath: string): void;
