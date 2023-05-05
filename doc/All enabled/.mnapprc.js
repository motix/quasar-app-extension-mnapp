module.exports = {
  'map-paths': true,
  frameworks: true,
  vendors: {
    prompts: {
      vendors: 'fap,axs,lds,jgd,atm,vld,mkd',
    },
  },
  config: true,
  formats: true,
  'select-date-range': true,
  utils: true,
  'page-title': true,
  'shared-components': true,
  'document-status': true,
  notifications: true,
  scroll: true,
  'float-toolbar': true,
  'sticky-headers': true,
  'multi-views': true,
  'return-url': true,
  apexcharts: true,
  'export-to-excel': true,
  firebase: {
    prompts: {
      project: '',
      targetName: '',
      siteId: '',
      authEmulatorPort: '4001',
      functionsEmulatorPort: '5001',
      firestoreEmulatorPort: '6001',
      storageEmulatorPort: '2001',
    },
  },
  'firebase-auth': {
    prompts: {
      userRoles: '',
    },
  },
  'firebase-firestore': true,
  'rich-editor': true,
  slack: true,
  'single-scope-composable': true,
  'crud-pages': true,
  'app-default': {
    prompts: {
      devServerPort: 9000,
      https: true,
      dark: true,
    },
  },
};
