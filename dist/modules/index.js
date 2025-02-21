import fs from 'fs'
import getExtensionConfig from '../lib/extension-config.js'
export default async function (appDir, script) {
  const config = await getExtensionConfig(appDir)
  let modules = []
  const files = fs.readdirSync(import.meta.dirname)
  for (const file of files) {
    if (file === 'index.js' || !config.hasModule(file)) continue
    try {
      const module = (await import(`./${file}/${script}.js`)).default
      Object.defineProperty(module, 'name', { value: file })
      modules[config.moduleIndex(file)] = module
    } catch {
      // prompts, index, install or uninstall might be missing in a module
    }
  }
  modules = modules.filter((value) => !!value)
  if (script === 'uninstall') {
    modules.reverse()
  }
  return modules
}
export {
  defineIndex,
  defineInstall,
  definePrompts,
  defineUninstall,
} from '../lib/extension-wrappers.js'
