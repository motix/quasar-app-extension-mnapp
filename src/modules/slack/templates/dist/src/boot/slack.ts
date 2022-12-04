import { boot } from 'quasar/wrappers';

import useConfig from 'composables/useConfig';

export default boot(() => {
  const config = useConfig();

  config.slackWorkspaceUrl = '<%= prompts.workspaceUrl %>';
});
