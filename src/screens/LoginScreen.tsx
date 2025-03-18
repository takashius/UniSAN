import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { LoginForm, RegisterForm } from "../components/auth/AuthForms";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";

const LoginScreen = () => {
  const { t } = useTranslation();
  const { login } = useUser();
  const handleDemoLogin = () => {
    login({
      email: "takashi.onimaru@gmail.com",
      name: 'Usuario Ejemplo',
      token: 'fake-token',
    });
  };

  return (
    <View style={styles.container}>
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
                <TouchableOpacity onPress={handleDemoLogin} style={styles.demoLink}>
                  <Text style={styles.demoText}>{t("auth.demoText")}</Text>
                </TouchableOpacity>
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
  },

});
