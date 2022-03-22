// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { PromptRecord, PromptsDefinition } = require('./lib/extension-wrappers');

const getModules = require('./modules');
const { definePrompts, getExtensionConfig } = getModules;

module.exports = definePrompts(function () {
  /**
   * @type PromptsDefinition[]
   */
  const modules = getModules('prompts');
  const config = getExtensionConfig();
  /**
   * @type PromptRecord[]
   */
  let prompts = [];

  /**
   * @param {string} str
   */
  const normalizeModuleName = (str) =>
    str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

  for (const module of modules) {
    const modulePrompts = module();

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
});
