/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PASSWORD_MIN_LENGTH: string;
  readonly VITE_ADMIN_CARS_PAGINATION_LIMIT: string;
  readonly VITE_ALLOWED_CAR_IMAGES_AMOUNT: string;
  readonly VITE_ADMIN_TRANSACTIONS_PAGINATION_LIMIT: string;
  readonly VITE_USER_CARS_PAGINATION_LIMIT: string;
  readonly VITE_USER_RENTAL_HISTORY_PAGINATION_LIMIT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
