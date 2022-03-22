import { boot } from 'quasar/wrappers';

export default boot(({ router }) => {
  router.addRoute({
    path: '/',
    component: () => import('layouts/FloatToolbarLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/float-toolbar',
        component: () => import('pages/FloatToolbar.vue'),
      },
    ],
  });
});
