import { Alert } from "react-native";
import type { Account } from "../types";

type Translate = (key: string) => string;

export function isProfileComplete(user: Account | null | undefined): boolean {
  return user?.profileCompletion?.complete === true;
}

type ProfileNavigator = {
  navigate: (name: string, params?: object) => void;
};

export function openEditProfile(navigation: ProfileNavigator) {
  navigation.navigate("Profile", { screen: "EditProfile" });
}

export function guardJoinWithProfile(
  user: Account | null | undefined,
  navigation: ProfileNavigator,
  t: Translate,
): boolean {
  if (isProfileComplete(user)) return true;
  Alert.alert(
    t("ProfileCompletion.joinBlockedTitle"),
    t("ProfileCompletion.joinBlockedMessage"),
    [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("ProfileCompletion.goToProfile"),
        onPress: () => openEditProfile(navigation),
      },
    ],
  );
  return false;
}
