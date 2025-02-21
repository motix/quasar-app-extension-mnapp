import getExtensionConfig from './lib/extension-config.js';
import normalizeModuleName from './lib/normalize-module-name.js';
import getModules from './modules/index.js';
export default async function (api) {
    const modules = await getModules(api.appDir, 'prompts');
    const config = await getExtensionConfig(api.appDir);
    let prompts = [];
    for (const module of modules) {
        const modulePrompts = await module(api);
        const moduleName = normalizeModuleName(module.name);
        if (config.hasPrompts(moduleName)) {
            const promptsConfig = config.prompts(moduleName);
            for (const modulePrompt of modulePrompts) {
                if (promptsConfig[modulePrompt.name] !== undefined) {
                    modulePrompt.default = promptsConfig[modulePrompt.name];
                }
            }
        }
        prompts = [...prompts, ...modulePrompts];
    }
    return prompts;
}
