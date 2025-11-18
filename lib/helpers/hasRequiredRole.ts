export function hasRequiredRole(
  userRoles: string[],
  requiredRoles: string[]
): boolean {
  return requiredRoles.some((role) => userRoles.includes(role));
}
