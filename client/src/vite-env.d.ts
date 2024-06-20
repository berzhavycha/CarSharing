/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_PASSWORD_MIN_LENGTH: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}