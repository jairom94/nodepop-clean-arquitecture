/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API del backend (ej: http://localhost:3001/api) */
  readonly VITE_API_URL: string;
  /** Nombre de la aplicación mostrado en la UI */
  readonly VITE_APP_NAME?: string;
  /** Modo de la app: development | production | test */
  readonly MODE: 'development' | 'production' | 'test';
  /** true si Vite está sirviendo en modo desarrollo */
  readonly DEV: boolean;
  /** true si Vite está construyendo para producción */
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
