/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Backend URL in production (Render); empty in development thanks to the Vite proxy
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
