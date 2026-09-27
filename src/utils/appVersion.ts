import * as Updates from "expo-updates";
import appConfig from "../../config.json";

export function getAppVersion(): string {
  return appConfig.version || "0.0.0";
}

export function compareAppVersions(left: string, right: string): number {
  const leftParts = String(left)
    .trim()
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);
  const rightParts = String(right)
    .trim()
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);
  const length = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < length; index += 1) {
    const delta = (leftParts[index] || 0) - (rightParts[index] || 0);
    if (delta > 0) return 1;
    if (delta < 0) return -1;
  }
  return 0;
}

export function isRemoteAppNewer(remote: string, local = getAppVersion()): boolean {
  if (!remote.trim()) return false;
  return compareAppVersions(remote, local) > 0;
}

export async function applyOtaUpdate(): Promise<boolean> {
  if (!Updates.isEnabled) return false;
  const result = await Updates.checkForUpdateAsync();
  if (!result.isAvailable) return false;
  await Updates.fetchUpdateAsync();
  await Updates.reloadAsync();
  return true;
}

export function getBundleCreatedAt(): Date | null {
  try {
    return Updates.createdAt instanceof Date ? Updates.createdAt : null;
  } catch {
    return null;
  }
}

export function formatBundleTimestamp(date: Date): string {
  return date.toLocaleString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
