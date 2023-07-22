import { reactive } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {} // To be augmented

// Data

const config = reactive<Config>({});

function requiredConfigEntry(key: Extract<keyof Config, string>) {
  const value = config[key];

  if (value === undefined) {
    throw new Error(`[mnapp-config] ${key} not set`);
  }

  return value;
}

export function requiredConfigEntries<
  TKey extends Extract<keyof Config, string>,
>(...keys: TKey[]) {
  const entries: Record<string, unknown> = {};

  keys.forEach((key) => {
    entries[key] = requiredConfigEntry(key);
  });

  return entries as Required<Pick<Config, TKey>>;
}

export default function useConfig() {
  return config;
}
