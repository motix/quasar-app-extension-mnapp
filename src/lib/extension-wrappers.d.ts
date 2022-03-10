import {
  SharedAPI,
  InstallAPI,
  IndexAPI as OriginalIndexAPI,
  UninstallAPI
} from '@quasar/app'

export type PromptRecord = {
  name: string,
  type: 'input' | 'number' | 'confirm',
  message: string,
  default: unknown
}

// IndexAPI has wrong extendQuasarConf definition
type IndexAPI = Omit<OriginalIndexAPI, 'extendQuasarConf'> & {
  extendQuasarConf: (fn: OriginalIndexAPI['extendQuasarConf']) => void
}
type PromptsCallback = () => PromptRecord[]
type InstallCallback = (api: InstallAPI) => void
type IndexCallback = (api: IndexAPI) => void
// UninstallAPI doesn't extend SharedAPI as it should
type UninstallCallback = (api: UninstallAPI & SharedAPI) => void

export type PromptsDefinition = PromptsCallback
export type InstallDefinition = InstallCallback & {
  extendPackageJson: Record<string, unknown>,
  extendJsonFiles: Record<string, unknown>
}
export type IndexDefinition = IndexCallback
export type UninstallDefinition = UninstallCallback & {
  revertFiles: string[]
}

export declare function definePrompts(callback: PromptsCallback): PromptsCallback
export declare function defineInstall(callback: InstallCallback): InstallCallback
export declare function defineIndex(callback: IndexCallback): IndexCallback
export declare function defineUninstall(callback: UninstallCallback): UninstallCallback
