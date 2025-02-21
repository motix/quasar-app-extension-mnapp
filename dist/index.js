import getModules from './modules/index.js';
export default async function (api) {
    const modules = await getModules(api.appDir, 'index');
    for (const module of modules) {
        await module(api);
    }
}
