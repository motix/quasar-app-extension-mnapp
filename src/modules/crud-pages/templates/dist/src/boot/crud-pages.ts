import { boot } from 'quasar/wrappers';

import ListPage from 'components/shared/crud-pages/ListPage.vue';
import NewPage from 'components/shared/crud-pages/NewPage.vue';
import ViewPage from 'components/shared/crud-pages/ViewPage.vue';

export default boot(({ app }) => {
  app.component('ListPage', ListPage);
  app.component('ViewPage', ViewPage);
  app.component('NewPage', NewPage);
});
