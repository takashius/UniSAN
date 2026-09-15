import { Platform } from "react-native";
import { isRunningInExpoGo } from "expo";
import Constants from "expo-constants";
import ERDEAxios from "./ERDEAxios";
import SecureStoreManager from "../components/AsyncStorageManager";

const ANDROID_CHANNEL_ID = "default";

export function canUseRemotePush() {
  return !isRunningInExpoGo();
}

/**
 * No importar `expo-notifications` en Expo Go: desde SDK 53 el módulo
 * lanza al cargarse en Android (push remoto ya no existe ahí).
 */
async function loadNotifications() {
  if (!canUseRemotePush()) {
    return null;
  }
  return import("expo-notifications");
}

export function configureNotificationHandler() {
  void loadNotifications().then((Notifications) => {
    Notifications?.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  });
}

export async function areNotificationsEnabled() {
  const stored = await SecureStoreManager.getItem<boolean>("notificationsEnabled");
  return stored !== false;
}

export async function setNotificationsPreference(enabled: boolean) {
  await SecureStoreManager.setItem("notificationsEnabled", enabled);
  if (enabled) {
    return registerAndSyncPushToken();
  }
  if (!canUseRemotePush()) {
    return null;
  }
  try {
    await ERDEAxios.post("/user/updateDeviceToken", { expoPushToken: "" });
  } catch (error) {
    console.log("No se pudo limpiar el token de notificaciones", error);
  }
  return null;
}

export async function registerAndSyncPushToken() {
  const Notifications = await loadNotifications();
  if (!Notifications) {
    return null;
  }
  if (!(await areNotificationsEnabled())) {
    return null;
  }

  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== "granted") {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "General",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#ff7f50",
    });
  }

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId;
    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    const token = tokenResponse.data;
    if (!token) return null;
    await ERDEAxios.post("/user/updateDeviceToken", { expoPushToken: token });
    return token;
  } catch {
    console.log("No se pudo registrar el token de notificaciones");
    return null;
  }
}
