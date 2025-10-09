/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: 'local' | 'staging' | 'production';
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
