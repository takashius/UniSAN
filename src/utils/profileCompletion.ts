import { Alert } from "react-native";
import type { Account } from "../types";

type Translate = (key: string) => string;

export function isProfileComplete(user: Account | null | undefined): boolean {
  return user?.profileCompletion?.complete === true;
}

export function openEditProfile(navigation: { navigate: (...args: any[]) => void }) {
  navigation.navigate("Profile", { screen: "EditProfile" });
}

export function guardJoinWithProfile(
  user: Account | null | undefined,
  navigation: { navigate: (...args: any[]) => void },
  t: Translate
): boolean {
  if (isProfileComplete(user)) return true;
  Alert.alert(t("ProfileCompletion.joinBlockedTitle"), t("ProfileCompletion.joinBlockedMessage"), [
    { text: t("common.cancel"), style: "cancel" },
    {
      text: t("ProfileCompletion.goToProfile"),
      onPress: () => openEditProfile(navigation),
    },
  ]);
  return false;
}
