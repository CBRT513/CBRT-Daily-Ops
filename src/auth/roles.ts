export type Role = 'viewer' | 'loader' | 'supervisor' | 'admin'
export const ROLE_ORDER: Role[] = ['viewer', 'loader', 'supervisor', 'admin']
export function roleAtLeast(current: Role | null | undefined, min: Role): boolean {
  if (!current) return false
  return ROLE_ORDER.indexOf(current) >= ROLE_ORDER.indexOf(min)
}
