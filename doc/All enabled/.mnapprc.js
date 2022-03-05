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
      vendors: 'pin,fap,axs,lds,jgd,atm,vld,mkd,jtv'
    }
  },
  config: true,
  formats: true,
  utils: true,
  'page-title': true,
  'shared-components': true,
  firebase: {
    prompts: {
      features: 'aut,str',
      userRoles: '',
      authEmulatorPort: '9099',
      functionsEmulatorPort: '5001',
      firestoreEmulatorPort: '6060'
    }
  },
  notifications: true,
  scroll: true,
  'float-toolbar': true,
  'sticky-headers': true,
  'multi-views': true,
  'return-url': true,
  'single-scope-composable': true,
  'crud-pages': true,
  authentication: true,
  'app-default': {
    prompts: {
      devServerPort: 8080
    }
  }
}
