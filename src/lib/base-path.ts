/**
 * Base path of the deployment, for example `/QuroniKarim` on GitHub Pages.
 * The value is inlined at build time, so it must be set while `next build`
 * runs (see `.github/workflows/deploy-pages.yml`).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const EXTERNAL_URL = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;

/** Prefix a root-relative public URL with the deployment base path. */
export function withBasePath(path: string): string {
  if (
    !path ||
    EXTERNAL_URL.test(path) ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  if (!BASE_PATH || path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) {
    return path;
  }

  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
