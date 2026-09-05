declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare const __APP_VERSION__: string;
declare const __DOCUMENT_VERSION__: string;
declare const __IS_PRODUCTION__: boolean;
declare const global: typeof globalThis;
