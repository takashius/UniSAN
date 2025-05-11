import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import { IconButton, Button } from "react-native-paper";

const SANPlaceholder = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <IconButton
          icon="alert-circle-outline"
          size={54}
        />
      </View>

      {/* Texto centrado */}
      <Text style={styles.secondaryText}>
        {t('HomeScreen.noSans')}
      </Text>

      <Button
        mode="contained"
        icon="magnify"
        onPress={() => navigation.navigate("Explorer")}
        style={styles.button}
      >
        {t('HomeScreen.explore')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  iconCircle: {
    backgroundColor: "#f2f2f2",
    height: 72,
    width: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  secondaryText: {
    textAlign: "center",
    color: "#666666",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff7f50",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});

export default SANPlaceholder;