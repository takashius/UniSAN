export const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;

export function normalizeRoles(role: unknown): string[] {
  if (Array.isArray(role)) {
    return role.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof role === "string" && role.trim()) {
    return [role.trim()];
  }
  return [];
}

export function isAdminRole(role: unknown): boolean {
  return normalizeRoles(role).some((item) =>
    ADMIN_ROLES.includes(item as (typeof ADMIN_ROLES)[number]),
  );
}
