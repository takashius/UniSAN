import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface VerificationStepProps {
  navigation: any;
}

const EmailStepScreen: React.FC<VerificationStepProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmitEmail = () => {
    if (!email) {
      Alert.alert(t("EmailStepScreen.requiredField"), t("EmailStepScreen.enterEmail"));
      return;
    }
    Alert.alert(t("EmailStepScreen.codeSentTitle"), t("EmailStepScreen.codeSentMessage"));
    navigation.navigate("RecoveryPasswordStep2");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Mail size={32} color="#ff7f50" />
      </View>
      <Text style={styles.title}>{t("EmailStepScreen.title")}</Text>
      <Text style={styles.subtitle}>{t("EmailStepScreen.subtitle")}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("EmailStepScreen.emailLabel")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("EmailStepScreen.emailPlaceholder")}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#FF7F50" />
          <Text style={styles.buttonTextSecondary}>{t("EmailStepScreen.backButton")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmitEmail}>
          <Text style={styles.buttonText}>{t("EmailStepScreen.sendCodeButton")}</Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default EmailStepScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 8,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#ff7f50",
    padding: 16,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF7F50",
    marginRight: 8,
  },
  buttonTextSecondary: {
    color: "#FF7F50",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonTextPrimary: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: "#FF7F50",
    marginLeft: 8,
  },
});
