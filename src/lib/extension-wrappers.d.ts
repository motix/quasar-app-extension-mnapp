import {
  IndexAPI as OriginalIndexAPI,
  InstallAPI,
  SharedAPI,
  UninstallAPI,
} from '@quasar/app-vite';

export type PromptRecord = {
  name: string;
  type: 'input' | 'number' | 'confirm';
  message: string;
  default: unknown;
};

// IndexAPI has wrong extendQuasarConf definition
type IndexAPI = Omit<OriginalIndexAPI, 'extendQuasarConf'> & {
  extendQuasarConf: (fn: OriginalIndexAPI['extendQuasarConf']) => void;
};
type PromptsCallback = () => PromptRecord[];
type InstallCallback = (api: InstallAPI) => void;
type IndexCallback = (api: IndexAPI) => void;
// UninstallAPI doesn't extend SharedAPI as it should.
// Also add extendJsonFile to the api.
type UninstallCallback = (
  api: UninstallAPI & SharedAPI & Pick<InstallAPI, 'extendJsonFile'>
) => void;

export type PromptsDefinition = PromptsCallback;
export type InstallDefinition = InstallCallback;
export type IndexDefinition = IndexCallback;
export type UninstallDefinition = UninstallCallback;

export declare function definePrompts(
  callback: PromptsCallback
): PromptsCallback;
export declare function defineInstall(
  callback: InstallCallback
): InstallCallback;
export declare function defineIndex(callback: IndexCallback): IndexCallback;
export declare function defineUninstall(
  callback: UninstallCallback
): UninstallCallback;
