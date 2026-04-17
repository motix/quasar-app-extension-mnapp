import fs from 'fs';
import path from 'path';
import { getPackageName } from './package-name.js';
export default async function (appDir) {
    let modules = {};
    let moduleNames = [];
    let rawConfig;
    const implementedModulesPath = path.resolve(import.meta.dirname, '../modules');
    const implementedModules = fs
        .readdirSync(implementedModulesPath)
        .filter((value) => fs.lstatSync(path.resolve(implementedModulesPath, value)).isDirectory());
    const config = {
        deployToDev: true,
        hasModule: (name) => implementedModules.includes(name) && !!modules[name],
        hasPrompts: (name) => implementedModules.includes(name) && typeof modules[name] === 'object'
            ? !!modules[name].prompts
            : false,
        prompts: (name) => implementedModules.includes(name) &&
            typeof modules[name] === 'object' &&
            !!modules[name].prompts
            ? modules[name].prompts
            : (() => {
                throw new Error(`Module '${name}' does not exist or it doesn't have prompts.`);
            })(),
        moduleIndex: (name) => moduleNames.indexOf(name),
    };
    try {
        const packageName = getPackageName().replace(/-/g, '');
        rawConfig = (await import(`${appDir}/.${packageName}rc.js`)).default;
        if (rawConfig.deployToDev !== undefined) {
            config.deployToDev = rawConfig.deployToDev;
        }
        modules = rawConfig.modules || {};
    }
    catch {
        // .[packageName]rc.js might not exist in appDir
    }
    moduleNames = Object.getOwnPropertyNames(modules).filter((value) => implementedModules.includes(value));
    return config;
}
