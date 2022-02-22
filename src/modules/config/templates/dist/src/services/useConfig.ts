import { reactive } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config { } // To be augmented

// Data

const config = reactive<Config>({
})

function requiredConfigEntry (key: keyof Config) {
  const value = config[key]

  if (value === undefined) {
    throw new Error(`[mnapp-config] ${key} not set`)
  }

  return value
}

export function requiredConfigEntries (...keys: (keyof Config)[]) {
  return Object.fromEntries(keys.map(key => [key, requiredConfigEntry(key)])) as Required<Config>
}

export default function useConfig () {
  return config
}
