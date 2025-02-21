// @ts-expect-error Importing from a specific path in node_modules
import { InstallAPI as InstallAPIClass } from '../../node_modules/@quasar/app-vite/lib/app-extension/api-classes/InstallAPI.js';
// @ts-expect-error Importing from a specific path in node_modules
import { getCallerPath } from '../../node_modules/@quasar/app-vite/lib/utils/get-caller-path.js';
import getExtensionConfig from './extension-config.js';
import removeTree from './remove-tree.js';
export function definePrompts(callback) {
    return callback;
}
export function defineIndex(callback) {
    const callerPath = getCallerPath();
    const moduleName = callerPath.substring(callerPath.lastIndexOf('/') + 1);
    return async (api) => {
        await extendApi(moduleName, api);
        return callback(api);
    };
}
export function defineInstall(callback) {
    const callerPath = getCallerPath();
    const moduleName = callerPath.substring(callerPath.lastIndexOf('/') + 1);
    return async (api) => {
        await extendApi(moduleName, api);
        Object.assign(api, {
            renderTemplate(name = 'dist', scope) {
                api.render(`../../templates/modules/${moduleName}/${name}`, scope);
            },
        });
        return callback(api);
    };
}
export function defineUninstall(callback) {
    const callerPath = getCallerPath();
    const moduleName = callerPath.substring(callerPath.lastIndexOf('/') + 1);
    return async (api) => {
        await extendApi(moduleName, api);
        const installApi = new InstallAPIClass({
            ctx: api.ctx,
            extId: api.extId,
            prompts: api.prompts,
        });
        Object.assign(api, {
            extendJsonFile: (file, newData) => {
                installApi.extendJsonFile(file, newData);
            },
            removeTemplateTree: (name = 'dist', options) => {
                removeTree(api, `../../templates/modules/${moduleName}/${name}`, options);
            },
        });
        return callback(api);
    };
}
async function extendApi(moduleName, api) {
    await mergePrompts(moduleName, api);
    const config = await getExtensionConfig(api.appDir);
    const extendedFunctions = {
        hasModule: (name) => config.hasModule(name),
        deployToDev: () => api.appDir.endsWith('/dev') || api.appDir.endsWith('\\dev') || api.appDir.endsWith('-dev'),
    };
    Object.assign(api, extendedFunctions);
}
async function mergePrompts(moduleName, api) {
    const config = await getExtensionConfig(api.appDir);
    if (config.hasPrompts(moduleName)) {
        const promptsConfig = config.prompts(moduleName);
        for (const prompt in promptsConfig) {
            if (promptsConfig[prompt] !== undefined && api.prompts[prompt] === undefined) {
                api.prompts[prompt] = promptsConfig[prompt];
            }
        }
    }
}
