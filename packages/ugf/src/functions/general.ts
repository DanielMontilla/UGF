export const _ = null;

export function isIn<T extends string | symbol | number>(
  object: Record<T, any>,
  key: string | symbol | number,
): key is T {
  return key in object;
}