import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  formatBundleTimestamp,
  getAppVersion,
  getBundleCreatedAt,
  getNativeBuild,
} from "../../utils/appVersion";

const AppVersionLabel = () => {
  const { t } = useTranslation();
  const appVersion = getAppVersion();
  const nativeBuild = getNativeBuild();
  const createdAt = getBundleCreatedAt();
  const versionLabel = nativeBuild
    ? t("Profile.appVersionBuild", { version: appVersion, build: nativeBuild })
    : t("Profile.appVersion", { version: appVersion });

  return (
    <View style={styles.wrap}>
      <Text style={styles.version}>{versionLabel}</Text>
      {createdAt ? (
        <Text style={styles.date}>{formatBundleTimestamp(createdAt)}</Text>
      ) : null}
    </View>
  );
};

export default AppVersionLabel;

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  version: {
    fontSize: 12,
    color: "#9ca3af",
  },
  date: {
    marginTop: 2,
    fontSize: 11,
    color: "#9ca3af",
  },
});
