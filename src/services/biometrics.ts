import { Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import SecureStoreManager from "../components/AsyncStorageManager";

type BiometricSecret = {
  email: string;
  password: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function readSecret() {
  return SecureStoreManager.getItem<BiometricSecret>("biometricSecret");
}

async function readDeclined() {
  return (
    (await SecureStoreManager.getItem<string[]>("biometricDeclinedEmails")) ??
    []
  );
}

export async function canUseBiometrics() {
  const hardware = await LocalAuthentication.hasHardwareAsync();
  if (!hardware) return false;
  return LocalAuthentication.isEnrolledAsync();
}

export async function getEnrolledEmail() {
  const secret = await readSecret();
  return secret?.email ?? null;
}

export async function isBiometricEnabled(email: string) {
  const enrolled = await getEnrolledEmail();
  return Boolean(enrolled && enrolled === normalizeEmail(email));
}

export async function enableBiometric(email: string, password: string) {
  const normalized = normalizeEmail(email);
  await SecureStoreManager.setItem<BiometricSecret>("biometricSecret", {
    email: normalized,
    password,
  });
  const declined = (await readDeclined()).filter((item) => item !== normalized);
  await SecureStoreManager.setItem("biometricDeclinedEmails", declined);
}

export async function declineBiometric(email: string) {
  const normalized = normalizeEmail(email);
  const declined = await readDeclined();
  if (!declined.includes(normalized)) {
    await SecureStoreManager.setItem("biometricDeclinedEmails", [
      ...declined,
      normalized,
    ]);
  }
  const secret = await readSecret();
  if (secret?.email === normalized) {
    await SecureStoreManager.removeItem("biometricSecret");
  }
}

export async function refreshBiometricPassword(email: string, password: string) {
  if (!password || !(await isBiometricEnabled(email))) return;
  await enableBiometric(email, password);
}

export async function promptBiometric(promptMessage: string, cancelLabel: string) {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel,
    disableDeviceFallback: false,
  });
  return result.success;
}

export async function readBiometricSecret() {
  return readSecret();
}

function waitForDialogToClose() {
  return new Promise((resolve) => setTimeout(resolve, 400));
}

export function offerBiometricAfterLogin(
  email: string,
  password: string,
  copy: {
    title: string;
    message: string;
    yes: string;
    no: string;
    confirmPrompt: string;
    cancel: string;
  },
) {
  void (async () => {
    if (!(await canUseBiometrics())) return;
    const normalized = normalizeEmail(email);
    if (await isBiometricEnabled(normalized)) {
      await refreshBiometricPassword(normalized, password);
      return;
    }
    const declined = await readDeclined();
    if (declined.includes(normalized)) return;
    Alert.alert(copy.title, copy.message, [
      {
        text: copy.no,
        style: "cancel",
        onPress: () => {
          void declineBiometric(normalized);
        },
      },
      {
        text: copy.yes,
        onPress: () => {
          void (async () => {
            await waitForDialogToClose();
            const confirmed = await promptBiometric(copy.confirmPrompt, copy.cancel);
            if (!confirmed) return;
            await enableBiometric(normalized, password);
          })();
        },
      },
    ]);
  })();
}
