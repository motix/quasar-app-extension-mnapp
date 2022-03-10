/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

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

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const { PromptRecord, PromptsDefinition } = require('./lib/extension-wrappers')

const getModules = require('./modules')
const { definePrompts, getExtensionConfig } = getModules

module.exports = definePrompts(function () {
  /**
   * @type PromptsDefinition[]
   */
  const modules = getModules('prompts')
  const config = getExtensionConfig()
  /**
   * @type PromptRecord[]
   */
  let prompts = []

  /**
   * @param {string} str
   */
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
})
