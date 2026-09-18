import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";

export function getAppVersion(): string {
  return Constants.expoConfig?.version || "0.0.0";
}

export function getNativeBuild(): string {
  if (Platform.OS === "ios") {
    return String(Constants.expoConfig?.ios?.buildNumber || "");
  }
  const code = Constants.expoConfig?.android?.versionCode;
  return code != null ? String(code) : "";
}

export function getOtaUpdate() {
  try {
    if (!Updates.isEnabled || Updates.isEmbeddedLaunch || !Updates.updateId) {
      return null;
    }
    return {
      id: Updates.updateId.replace(/-/g, "").slice(0, 8),
      createdAt: Updates.createdAt instanceof Date ? Updates.createdAt : null,
    };
  } catch {
    return null;
  }
}

export function formatOtaTimestamp(date: Date): string {
  return date.toLocaleString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
