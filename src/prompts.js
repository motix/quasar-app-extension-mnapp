/**
 * Quasar App Extension prompts script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/prompts-api
 *
 * Inquirer prompts
 * (answers are available as "api.prompts" in the other scripts)
 * https://www.npmjs.com/package/inquirer#question
 *
 * Example:

  return [
    {
      name: 'name',
      type: 'input',
      required: true,
      message: 'Quasar CLI Extension name (without prefix)',
    },
    {
      name: 'preset',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [
        {
          name: 'Install script',
          value: 'install'
        },
        {
          name: 'Prompts script',
          value: 'prompts'
        },
        {
          name: 'Uninstall script',
          value: 'uninstall'
        }
      ]
    }
  ]

 */

const getModules = require('./modules')
const getExtensionConfig = require('./modules/extension-config')

module.exports = function () {
  const modules = getModules('prompts')
  const config = getExtensionConfig()
  let prompts = []

  const normalizeModuleName = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

  for (const module of modules) {
    const modulePrompts = module()

    const moduleName = normalizeModuleName(module.name)
    if (config.hasPrompts(moduleName)) {
      const promptsConfig = config.prompts(moduleName)

      for (const modulePrompt of modulePrompts) {
        if (promptsConfig[modulePrompt.name] !== undefined) {
          modulePrompt.default = promptsConfig[modulePrompt.name]
        }
      }
    }

    prompts = [
      ...prompts,
      ...modulePrompts
    ]
  }

  return prompts
}
