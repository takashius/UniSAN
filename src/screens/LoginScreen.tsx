import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { LoginForm, RegisterForm } from "../components/auth/AuthForms";
import { useTranslation } from "react-i18next";
import SecureStoreManager from "../components/AsyncStorageManager";
import { useAccount } from "../services/auth";
import { useUser } from "../context/UserContext";
import FullScreenLoader from "../components/ui/FullScreenLoader";

const LoginScreen = () => {
  const { t } = useTranslation();
  const { refetch } = useAccount();
  const { login } = useUser();
  const [restoringSession, setRestoringSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const token = await SecureStoreManager.getItem<string>("Token");
        if (token) {
          const user = await refetch();
          if (!cancelled && user.data) {
            login(user.data);
          }
        }
      } finally {
        if (!cancelled) {
          setRestoringSession(false);
        }
      }
    };

    void loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <FullScreenLoader visible={restoringSession} />
      <View style={styles.header}>
        <Image
          source={require("../../assets/logo-naranja.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.tabsContainer}>
          <Tabs defaultValue="login">
            <TabsList>
              <TabsTrigger value="login">{t("auth.loginTab")}</TabsTrigger>
              <TabsTrigger value="register">{t("auth.registerTab")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <LoginForm />
              </ScrollView>
            </TabsContent>

            <TabsContent value="register">
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <RegisterForm />
              </ScrollView>
            </TabsContent>
          </Tabs>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("auth.footerText")}</Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f1e7",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    paddingBottom: 5,
    marginTop: 24
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    maxWidth: 300,
  },
  contentWrapper: {
    flex: 1,
  },
  tabsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  demoLink: {
    marginTop: 16,
    alignItems: "center",
  },
  demoText: {
    fontSize: 14,
    color: "#ff7f50",
    textDecorationLine: "underline",
  },
  footer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f1e7",
  },
  footerText: {
    fontSize: 12,
    color: "#888888",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 16,
  }
});
