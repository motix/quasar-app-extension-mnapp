module.exports = {
  'map-paths': true,
  frameworks: {
    prompts: {
      vuex: true
    }
  },
  vite: true,
  vendors: {
    prompts: {
      vendors: 'fap,axs,lds,jgd,atm,vld,jtv'
    }
  },
  config: true,
  'shared-components': true,
  firebase: {
    prompts: {
      features: 'aut,hst',
      userRoles: 'moderator,editor',
      authEmulatorPort: '9099',
      functionsEmulatorPort: '5001',
      firestoreEmulatorPort: '6060'
    }
  },
  formats: true,
  rules: true,
  notifications: true,
  scroll: true,
  'float-toolbar': true,
  'sticky-headers': true,
  'multi-views': true,
  authentication: true,
  'app-default': {
    prompts: {
      devServerPort: 9998
    }
  }
}
