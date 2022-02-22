export const userRoles = ['admin', 'user<%= userRoles %>'] as const

export type UserRole = typeof userRoles[number]
export type UserClaims = Partial<Record<UserRole, boolean>>
