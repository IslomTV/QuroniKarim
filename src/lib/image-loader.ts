import { withBasePath } from "./base-path";

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

/**
 * Custom `next/image` loader for static exports. Public images are served from
 * the deployment sub-path (`/QuroniKarim/images/...`), while remote media is
 * left untouched.
 */
export default function imageLoader({ src }: ImageLoaderProps): string {
  return withBasePath(src);
}
