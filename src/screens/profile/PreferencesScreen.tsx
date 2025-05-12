import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Appbar, Card, Switch, Menu, Divider, Button } from "react-native-paper";
import { ChevronLeft, Bell, Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import generalStyles from "../../styles/general";

const Preferences: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>("es");
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    alert(value === "es" ? t("alerts.languageChangedEs") : t("alerts.languageChangedEn"));
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    alert(checked ? t("alerts.notificationsOn") : t("alerts.notificationsOff"));
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
                  <Text style={styles.subtitle}>{t("preferences.languageDescription")}</Text>
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
                      {language === "es" ? t("languages.es") : t("languages.en")}
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
                  <Text style={styles.label}>{t("preferences.notifications")}</Text>
                  <Text style={styles.subtitle}>{t("preferences.notificationsDescription")}</Text>
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

        {/* About Section */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <Text style={styles.cardTitle}>{t("about.title")}</Text>
            <Text style={styles.cardSubtitle}>{t("about.description")}</Text>
            <Divider style={styles.divider} />
            <View style={styles.aboutInfo}>
              <Text style={styles.text}>{t("about.version")}</Text>
              <Text style={styles.text}>{t("about.rights")}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
});