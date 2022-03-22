import { boot } from 'quasar/wrappers';

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    if (
      from.meta.isNoReturnPage ||
      // from route for first page
      (from.fullPath === '/' && Object.keys(from.meta).length === 0) ||
      // Foutes from firebase-auth module of mnapp extension
      from.name === 'SignIn' ||
      from.name === 'RemoteSignIn'
    ) {
      delete to.meta.history;
      next();
      return;
    }

    if (to.meta.returnRequired) {
      const history = from.meta.history || [];

      if (from.meta.goingBack) {
        history.shift();
      } else {
        history.unshift(from.path);
      }

      to.meta.history = history;
    }

    delete from.meta.goingBack;

    next();
  });
});
