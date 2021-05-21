import { reactive } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config { } // To be augmented

const config = reactive<Config>({
})

export default function () {
  return config
}
