/** Paths that must not be treated as public profile handles. */
export const RESERVED_HANDLES = new Set([
  "login",
  "signup",
  "dashboard",
  "settings",
  "confirm",
  "api",
]);

export function isReservedHandle(handle: string) {
  return RESERVED_HANDLES.has(handle.toLowerCase());
}
