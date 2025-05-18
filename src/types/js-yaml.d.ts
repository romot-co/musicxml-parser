declare module "js-yaml" {
  export function dump(obj: unknown, options?: unknown): string;
  export function load(str: string): unknown;
}
