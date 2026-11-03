/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UN_API_BASE_URL: string;
  readonly VITE_UNSC_BENCH_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
