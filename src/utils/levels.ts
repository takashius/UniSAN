import type { LevelType, SanLevel, SanSettings } from "../types/settings";

export const DEFAULT_MEMBERS_PER_SAN = 10;

export function getMaxLevel(levels: SanLevel[] | undefined): number {
  const configured = (levels ?? [])
    .map((item) => item.level)
    .filter((level) => typeof level === "number");
  return configured.length ? Math.max(...configured) : 1;
}

/** Topes de monto del nivel, de menor a mayor. */
export function getLevelCaps(
  levels: SanLevel[] | undefined,
  level: number,
): number[] {
  const config = (levels ?? []).find((item) => item.level === level);
  return config?.amounts?.length
    ? [...config.amounts].sort((a, b) => a - b)
    : [];
}

/** Tope más alto del nivel: un san califica si no lo pasa. */
export function getMaxCap(
  levels: SanLevel[] | undefined,
  level: number,
): number | null {
  const caps = getLevelCaps(levels, level);
  return caps.length ? Math.max(...caps) : null;
}

export function getPointsThreshold(
  settings: SanSettings | undefined,
  level: number,
): number | null {
  const raw = settings?.pointsThresholds;
  if (!raw) return null;
  const value = raw[String(level)] ?? (raw as Record<number, number>)[level];
  return typeof value === "number" ? value : null;
}

export function getLevelType(
  level: number,
  maxLevel: number | null,
): LevelType {
  if (level <= 1) return "initial";
  if (maxLevel != null && level >= maxLevel) return "max";
  return "intermediate";
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString("es-VE");
}
