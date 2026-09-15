export type Role = "user" | "admin" | "teacher";

export const validRoles: Role[] = ["user", "admin", "teacher"];

export function isRole(value: unknown): value is Role {
  return validRoles.includes(value as Role);
}