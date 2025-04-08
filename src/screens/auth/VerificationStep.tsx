import React, { useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react-native";
import { InputOTP } from "../../components/ui/InputOtp";
import { useRecoveryTwo } from "../../services/auth";
import Toast from "react-native-toast-message";
import errorToast from "../../components/ui/ErrorToast";

interface VerificationStepProps {
  route: any;
  navigation: any;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { email } = route.params;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const recoveryMutate = useRecoveryTwo();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = (data: { verificationCode: string; newPassword: string; confirmPassword: string }) => {

    if (data.verificationCode.length !== 6) {
      Toast.show({
        type: 'error',
        text1: t("VerificationStep.invalidCodeTitle"),
        text2: t("VerificationStep.invalidCodeMessage")
      });
      return;
    }

    recoveryMutate.mutate(
      { code: Number(data.verificationCode), email, newPass: data.newPassword },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: t("VerificationStep.successTitle"),
            text2: t("VerificationStep.successMessage")
          });
          navigation.navigate("Login");
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: "Error",
            text2: `${errorToast(error)}`
          });
          console.log('Error:', error)
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Title and Subtitle */}
      <Text style={styles.title}>{t("VerificationStep.title")}</Text>
      <Text style={styles.subtitle}>{t("VerificationStep.subtitle")}</Text>

      {/* Verification Code */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t("VerificationStep.verificationCodeLabel")}</Text>
        <Controller
          control={control}
          name="verificationCode"
          rules={{
            required: t("VerificationStep.requiredField"),
            minLength: { value: 6, message: t("VerificationStep.invalidCodeMessage") },
          }}
          render={({ field: { onChange, value } }) => (
            <InputOTP
              value={value}
              length={6}
              onChangeText={onChange}
              containerStyle={styles.otpContainer}
              inputStyle={styles.otpSlot}
            />
          )}
        />
        {errors.verificationCode && (
          <Text style={styles.errorText}>{errors.verificationCode.message}</Text>
        )}
      </View>

      {/* New Password */}
      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: t("VerificationStep.requiredField"),
            minLength: { value: 8, message: t("VerificationStep.passwordMinLength") },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("VerificationStep.newPasswordPlaceholder")}
              secureTextEntry={!showPassword}
              value={value}
              activeUnderlineColor="#ff7f50"
              textColor="black"
              onChangeText={onChange}
              right={showPassword ?
                <TextInput.Icon icon="eye" color={'#ff7f50'} onPress={() => setShowPassword(!showPassword)} />
                : <TextInput.Icon icon="eye-off" color={'#ff7f50'} onPress={() => setShowPassword(!showPassword)} />}
              error={!!errors.newPassword}
              style={styles.input}
            />
          )}
        />
        {errors.newPassword && (
          <Text style={styles.errorText}>{errors.newPassword.message}</Text>
        )}
      </View>

      {/* Confirm Password */}
      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: t("VerificationStep.requiredField"),
            validate: (value) =>
              value === newPassword || t("VerificationStep.passwordMismatchMessage"),
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("VerificationStep.confirmPasswordPlaceholder")}
              secureTextEntry={!showPasswordConfirm}
              value={value}
              activeUnderlineColor="#ff7f50"
              textColor="black"
              onChangeText={onChange}
              right={showPasswordConfirm ?
                <TextInput.Icon icon="eye" color={'#ff7f50'} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} />
                : <TextInput.Icon icon="eye-off" color={'#ff7f50'} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} />}
              error={!!errors.confirmPassword}
              style={styles.input}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.secondaryButton}
          icon={() => <ArrowLeft size={20} color="#FF7F50" />}
          contentStyle={styles.secondaryButtonContent}
          labelStyle={styles.secondaryButtonText}
        >
          {t("EmailStepScreen.backButton")}
        </Button>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          loading={recoveryMutate.isPending}
          icon="arrow-right"
        >
          {t("VerificationStep.updateButton")}
        </Button>
      </View>
    </View>
  );
};

export default VerificationStep;

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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#FF7F50",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff7f50',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: "#FF7F50", // Mismo color que el borde
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonContent: {
    flexDirection: "row", // Mantener ícono y texto en línea
    justifyContent: "center",
    alignItems: "center",
  },
});