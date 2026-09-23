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

let consumedLastResponse = false;

type NotificationTapResponse = {
  notification?: {
    request?: {
      content?: {
        data?: {
          eventId?: string;
          transactionId?: string;
          transaction_id?: string;
          userId?: string;
          user_id?: string;
        };
      };
    };
  };
};

function paymentIdFromNotificationResponse(response: NotificationTapResponse | null): string | null {
  const data = response?.notification?.request?.content?.data;
  if (!data || String(data.eventId) !== "payment.receivedAdmin") return null;
  const id = data.transactionId ?? data.transaction_id;
  return id ? String(id) : null;
}

function documentUserIdFromNotificationResponse(response: NotificationTapResponse | null): string | null {
  const data = response?.notification?.request?.content?.data;
  if (!data || String(data.eventId) !== "document.receivedAdmin") return null;
  const id = data.userId ?? data.user_id;
  return id ? String(id) : null;
}

export function subscribeAdminPaymentTaps(
  onOpen: (transactionId: string) => void,
) {
  let unsubscribe = () => {};
  void loadNotifications().then(async (Notifications) => {
    if (!Notifications) return;
    if (!consumedLastResponse) {
      consumedLastResponse = true;
      const last = await Notifications.getLastNotificationResponseAsync();
      const fromLast = paymentIdFromNotificationResponse(last);
      if (fromLast) onOpen(fromLast);
    }
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const id = paymentIdFromNotificationResponse(response);
        if (id) onOpen(id);
      },
    );
    unsubscribe = () => subscription.remove();
  });
  return () => unsubscribe();
}

const DOCUMENT_DECISION_EVENTS = new Set([
  "document.approved",
  "document.rejected",
]);

function eventIdFromData(data?: { eventId?: string } | null): string | null {
  if (!data?.eventId) return null;
  return String(data.eventId);
}

export function subscribeDocumentDecisionNotifications(onDecision: () => void) {
  let unsubscribe = () => {};
  void loadNotifications().then((Notifications) => {
    if (!Notifications) return;
    const received = Notifications.addNotificationReceivedListener(
      (notification) => {
        const eventId = eventIdFromData(notification.request.content.data);
        if (eventId && DOCUMENT_DECISION_EVENTS.has(eventId)) onDecision();
      },
    );
    const tapped = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const eventId = eventIdFromData(
          response.notification.request.content.data,
        );
        if (eventId && DOCUMENT_DECISION_EVENTS.has(eventId)) onDecision();
      },
    );
    unsubscribe = () => {
      received.remove();
      tapped.remove();
    };
  });
  return () => unsubscribe();
}

export function subscribeAdminDocumentTaps(onOpen: (userId: string) => void) {
  let unsubscribe = () => {};
  void loadNotifications().then(async (Notifications) => {
    if (!Notifications) return;
    const last = await Notifications.getLastNotificationResponseAsync();
    const fromLast = documentUserIdFromNotificationResponse(last);
    if (fromLast) onOpen(fromLast);
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const userId = documentUserIdFromNotificationResponse(response);
        if (userId) onOpen(userId);
      },
    );
    unsubscribe = () => subscription.remove();
  });
  return () => unsubscribe();
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
  const stored = await SecureStoreManager.getItem<boolean>(
    "notificationsEnabled",
  );
  return stored !== false;
}

export async function unregisterCurrentPushToken() {
  const stored = await SecureStoreManager.getItem<string>("expoPushToken");
  const token = stored || (await readCurrentExpoPushToken());
  if (!token) {
    await SecureStoreManager.removeItem("expoPushToken");
    return;
  }
  try {
    await ERDEAxios.post("/user/updateDeviceToken", {
      expoPushToken: token,
      remove: true,
    });
  } catch (error) {
    console.warn("No se pudo quitar el token de notificaciones", error);
  }
  await SecureStoreManager.removeItem("expoPushToken");
}

async function readCurrentExpoPushToken() {
  if (!canUseRemotePush()) {
    return null;
  }
  try {
    const Notifications = await loadNotifications();
    if (!Notifications) return null;
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId;
    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return tokenResponse.data || null;
  } catch {
    return null;
  }
}

export async function setNotificationsPreference(enabled: boolean) {
  await SecureStoreManager.setItem("notificationsEnabled", enabled);
  if (enabled) {
    return registerAndSyncPushToken();
  }
  await unregisterCurrentPushToken();
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
      projectId ? { projectId } : undefined,
    );
    const token = tokenResponse.data;
    if (!token) return null;
    await SecureStoreManager.setItem("expoPushToken", token);
    await ERDEAxios.post("/user/updateDeviceToken", { expoPushToken: token });
    return token;
  } catch {
    console.warn("No se pudo registrar el token de notificaciones");
    return null;
  }
}
