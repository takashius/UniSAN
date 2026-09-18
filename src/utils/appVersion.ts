import * as Updates from "expo-updates";
import appConfig from "../../config.json";

export function getAppVersion(): string {
  return appConfig.version || "0.0.0";
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
