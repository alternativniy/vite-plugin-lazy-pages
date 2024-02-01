import { normalizePath } from "vite";

export const VIRTUAL_MODULE_ID = 'virtual:lazy-pages';
export const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;
export const __ROOT = normalizePath(process.cwd());