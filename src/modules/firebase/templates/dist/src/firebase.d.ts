export { }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FIREBASE_ENV: 'DEV' | 'STAGE' | 'PROD' | undefined;
      FIREBASE_CONFIG: import('firebase/app').FirebaseOptions;
      FIREBASE_CLIENT_ID: string | undefined;
    }
  }
}

declare module 'composables/useConfig' {
  interface Config {
    firebaseRegion?: string;
  }
}
