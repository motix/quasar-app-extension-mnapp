import { boot } from 'quasar/wrappers';

export default boot(({ router }) => {
  router.addRoute({
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/notifications',
        component: () => import('pages/Notifications.vue'),
      },
    ],
  });
});
