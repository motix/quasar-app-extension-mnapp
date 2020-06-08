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
      type: 'string',
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

/* eslint-disable @typescript-eslint/no-var-requires */

const app = require('./modules/app/prompts')
const authentication = require('./modules/authentication/prompts')

module.exports = function () {
  function mergePrompts (...modules) {
    let prompts = []

    for (const module of modules) {
      prompts = [
        ...prompts,
        ...module()
      ]
    }

    return prompts
  }

  return mergePrompts(app, authentication)
}
