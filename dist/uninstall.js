import { reduceJsonFile } from './lib/json-helpers.js';
import { getPackageName } from './lib/package-name.js';
import getModules from './modules/index.js';
export default async function (api) {
    const modules = await getModules(api.appDir, 'uninstall');
    for (const module of modules) {
        await module(api);
    }
    const packageName = getPackageName();
    reduceJsonFile(api, 'package.json', [`scripts.u-${packageName}`, `scripts.r-${packageName}`]);
}
