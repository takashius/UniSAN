import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { fetchAppUpdate } from "../../services/appUpdate";
import {
  applyOtaUpdate,
  getAppVersion,
  isRemoteAppNewer,
} from "../../utils/appVersion";
import FullScreenLoader from "./FullScreenLoader";

const AppUpdateGate = () => {
  const { t } = useTranslation();
  const [applyingOta, setApplyingOta] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const remote = await fetchAppUpdate();
        if (cancelled || !remote.version) return;
        if (!isRemoteAppNewer(remote.version, getAppVersion())) return;

        if (remote.kind === "ota") {
          setApplyingOta(true);
          try {
            await applyOtaUpdate();
          } finally {
            if (!cancelled) setApplyingOta(false);
          }
          return;
        }

        if (!cancelled) {
          setStoreUrl(remote.storeUrl);
          setStoreOpen(true);
        }
      } catch (error) {
        console.warn(error);
        if (!cancelled) setApplyingOta(false);
      }
    };

    void check();
    return () => {
      cancelled = true;
    };
  }, []);

  const openStore = () => {
    if (!storeUrl) return;
    void Linking.openURL(storeUrl);
  };

  return (
    <>
      <FullScreenLoader visible={applyingOta} />
      <Portal>
        <Modal
          visible={storeOpen}
          onDismiss={() => setStoreOpen(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.title}>{t("Update.storeTitle")}</Text>
          <Text style={styles.message}>{t("Update.storeMessage")}</Text>
          <View style={styles.actions}>
            <Button textColor="#888" onPress={() => setStoreOpen(false)}>
              {t("Update.later")}
            </Button>
            <Button
              mode="contained"
              buttonColor="#ff7f50"
              onPress={openStore}
              disabled={!storeUrl}
            >
              {t("Update.goToStore")}
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export default AppUpdateGate;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
});
