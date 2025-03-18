import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react-native";
import { InputOTP } from "../../components/ui/InputOtp";
import { useTranslation } from "react-i18next";

interface VerificationStepProps {
  navigation: any;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleVerificationSubmit = () => {
    if (verificationCode.length !== 6) {
      Alert.alert(t("VerificationStep.invalidCodeTitle"), t("VerificationStep.invalidCodeMessage"));
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert(
        t("VerificationStep.requiredFieldsTitle"),
        t("VerificationStep.requiredFieldsMessage")
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        t("VerificationStep.passwordMismatchTitle"),
        t("VerificationStep.passwordMismatchMessage")
      );
      return;
    }

    Alert.alert(
      t("VerificationStep.successTitle"),
      t("VerificationStep.successMessage"),
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("VerificationStep.title")}</Text>
      <Text style={styles.subtitle}>{t("VerificationStep.subtitle")}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t("VerificationStep.verificationCodeLabel")}</Text>
        <InputOTP
          value={verificationCode}
          length={6}
          onChangeText={setVerificationCode}
          containerStyle={styles.otpContainer}
          inputStyle={styles.otpSlot}
        />
      </View>

      <View style={styles.passwordInputContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.input, styles.textInputWithIcon]}
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t("VerificationStep.newPasswordPlaceholder")}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} color="#ff7f50" /> : <Eye size={20} color="#ff7f50" />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.passwordInputContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.input, styles.textInputWithIcon]}
            secureTextEntry={!showPasswordConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t("VerificationStep.confirmPasswordPlaceholder")}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
          >
            {showPasswordConfirm ? <EyeOff size={20} color="#ff7f50" /> : <Eye size={20} color="#ff7f50" />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#FF7F50" />
          <Text style={styles.buttonTextSecondary}>{t("VerificationStep.backButton")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleVerificationSubmit}
        >
          <Text style={styles.buttonTextPrimary}>{t("VerificationStep.updateButton")}</Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  otpContainer: {
    justifyContent: "center",
    marginBottom: 16,
  },
  otpSlot: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#FF7F50",
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF7F50",
    marginRight: 8,
  },
  buttonTextPrimary: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonTextSecondary: {
    color: "#FF7F50",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  passwordInputContainer: {
    marginBottom: 16, // Añadir espacio inferior
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    flex: 1,
  },
  textInputWithIcon: {
    paddingRight: 45,
  }
});

export default VerificationStep;
