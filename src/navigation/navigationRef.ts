import { createNavigationContainerRef } from "@react-navigation/native";
import type { TabParamList } from "../types/navigation";

export const navigationRef = createNavigationContainerRef<TabParamList>();

let pendingPaymentId: string | null = null;
let pendingDocumentUserId: string | null = null;

export function queuePendingPayment(id: string) {
  pendingPaymentId = id;
}

export function consumeQueuedPendingPayment() {
  const id = pendingPaymentId;
  pendingPaymentId = null;
  return id;
}

export function openPendingPayment(id: string) {
  if (!id) return;
  if (navigationRef.isReady()) {
    navigationRef.navigate("Profile", {
      screen: "PendingPaymentDetail",
      params: { id },
    });
    return;
  }
  queuePendingPayment(id);
}

export function queuePendingDocument(userId: string) {
  pendingDocumentUserId = userId;
}

export function consumeQueuedPendingDocument() {
  const userId = pendingDocumentUserId;
  pendingDocumentUserId = null;
  return userId;
}

export function openPendingDocument(userId: string) {
  if (!userId) return;
  if (navigationRef.isReady()) {
    navigationRef.navigate("Profile", {
      screen: "PendingDocumentDetail",
      params: { userId },
    });
    return;
  }
  queuePendingDocument(userId);
}
