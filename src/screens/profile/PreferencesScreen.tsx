import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, Pressable } from "react-native";
import {
  Card,
  Switch,
  Menu,
  Divider,
  Button,
  Portal,
  TextInput,
} from "react-native-paper";
import { Bell, Fingerprint, Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import generalStyles from "../../styles/general";
import {
  areNotificationsEnabled,
  setNotificationsPreference,
} from "../../services/notifications";
import { getAppVersion } from "../../utils/appVersion";
import { useUser } from "../../context/UserContext";
import { useLogin } from "../../services/auth";
import SecureStoreManager from "../../components/AsyncStorageManager";
import {
  canUseBiometrics,
  declineBiometric,
  enableBiometric,
  isBiometricEnabled,
  promptBiometric,
} from "../../services/biometrics";

const Preferences: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>("es");
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricHardware, setBiometricHardware] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user } = useUser();
  const loginMutate = useLogin();
  const email = user?.user.email ?? "";

  useEffect(() => {
    void areNotificationsEnabled().then(setNotificationsEnabled);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadBiometric = async () => {
      const available = await canUseBiometrics();
      const enabled = email ? await isBiometricEnabled(email) : false;
      if (cancelled) return;
      setBiometricHardware(available);
      setBiometricEnabled(enabled);
    };
    void loadBiometric();
    return () => {
      cancelled = true;
    };
  }, [email]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    alert(
      value === "es"
        ? t("alerts.languageChangedEs")
        : t("alerts.languageChangedEn"),
    );
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    void setNotificationsPreference(checked);
    alert(checked ? t("alerts.notificationsOn") : t("alerts.notificationsOff"));
  };

  const handleBiometricChange = (checked: boolean) => {
    if (!biometricHardware) {
      Alert.alert(t("preferences.biometric"), t("preferences.biometricUnavailable"));
      return;
    }
    if (!checked) {
      void (async () => {
        const confirmed = await promptBiometric(
          t("auth.biometricDisablePrompt"),
          t("common.cancel"),
        );
        if (!confirmed) return;
        setBiometricEnabled(false);
        await declineBiometric(email);
        Alert.alert(t("preferences.biometric"), t("preferences.biometricOff"));
      })();
      return;
    }
    setConfirmPassword("");
    setPasswordDialog(true);
  };

  const confirmBiometricPassword = () => {
    const password = confirmPassword.trim();
    if (!password || !email) return;
    loginMutate.mutate(
      { email, password },
      {
        onSuccess: async (responseData) => {
          setPasswordDialog(false);
          await new Promise((resolve) => setTimeout(resolve, 400));
          const confirmed = await promptBiometric(
            t("auth.biometricEnablePrompt"),
            t("common.cancel"),
          );
          if (!confirmed) return;
          await SecureStoreManager.setItem<string>("Token", responseData.token);
          await enableBiometric(email, password);
          setBiometricEnabled(true);
          setPasswordDialog(false);
          setConfirmPassword("");
          Alert.alert(t("preferences.biometric"), t("preferences.biometricOn"));
        },
        onError: () => {
          Alert.alert(t("auth.loginErrorTitle"), t("auth.loginErrorMessage"));
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Language Setting */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Globe size={24} color="#ff7f50" />
                <View style={styles.rowText}>
                  <Text style={styles.label}>{t("preferences.language")}</Text>
                  <Text style={styles.subtitle}>
                    {t("preferences.languageDescription")}
                  </Text>
                </View>
              </View>
              <View>
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setMenuVisible(true)}
                    >
                      {language === "es"
                        ? t("languages.es")
                        : t("languages.en")}
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      handleLanguageChange("es");
                      setMenuVisible(false);
                    }}
                    title={t("languages.es")}
                  />
                  <Menu.Item
                    onPress={() => {
                      handleLanguageChange("en");
                      setMenuVisible(false);
                    }}
                    title={t("languages.en")}
                  />
                </Menu>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Notifications Setting */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Bell size={24} color="#ff7f50" />
                <View style={styles.rowText}>
                  <Text style={styles.label}>
                    {t("preferences.notifications")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t("preferences.notificationsDescription")}
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsChange}
                color="#ff7f50"
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Fingerprint size={24} color="#ff7f50" />
                <View style={styles.rowText}>
                  <Text style={styles.label}>{t("preferences.biometric")}</Text>
                  <Text style={styles.subtitle}>
                    {biometricHardware
                      ? t("preferences.biometricDescription")
                      : t("preferences.biometricUnavailable")}
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricChange}
                disabled={!biometricHardware || !email || loginMutate.isPending}
                color="#ff7f50"
              />
            </View>
          </Card.Content>
        </Card>

        {/* About Section */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <Text style={styles.cardTitle}>{t("about.title")}</Text>
            <Text style={styles.cardSubtitle}>{t("about.description")}</Text>
            <Divider style={styles.divider} />
            <View style={styles.aboutInfo}>
              <Text style={styles.text}>
                {t("about.version", { version: getAppVersion() })}
              </Text>
              <Text style={styles.text}>{t("about.rights")}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {passwordDialog ? (
        <Portal>
          <View style={styles.overlayRoot}>
            <Pressable
              style={styles.backdrop}
              onPress={() => setPasswordDialog(false)}
            />
            <View style={styles.dialogCenter} pointerEvents="box-none">
              <View style={styles.dialogCard}>
                <Text style={styles.dialogTitle}>
                  {t("preferences.biometricPasswordTitle")}
                </Text>
                <Text style={styles.dialogText}>
                  {t("preferences.biometricPasswordMessage")}
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  activeUnderlineColor="#ff7f50"
                  textColor="black"
                  label={t("auth.passwordPlaceholder")}
                  style={styles.passwordInput}
                />
                <View style={styles.dialogActions}>
                  <Button
                    mode="outlined"
                    textColor="#ff7f50"
                    style={styles.dialogAction}
                    onPress={() => setPasswordDialog(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    mode="contained"
                    buttonColor="#ff7f50"
                    style={styles.dialogAction}
                    onPress={confirmBiometricPassword}
                    disabled={!confirmPassword.trim() || loginMutate.isPending}
                  >
                    {t("common.confirm")}
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Portal>
      ) : null}
    </View>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContainer: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: 8,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowText: {
    marginLeft: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  divider: {
    marginVertical: 12,
  },
  aboutInfo: {
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: "#666",
  },
  overlayRoot: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  dialogCenter: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  dialogCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  dialogText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    marginBottom: 8,
  },
  passwordInput: {
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  dialogAction: {
    borderRadius: 8,
  },
});
