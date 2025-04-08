import React from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Mail } from "lucide-react-native";
import { useRecoveryOne } from "../../services/auth";
import Toast from "react-native-toast-message";
import errorToast from "../../components/ui/ErrorToast";

interface VerificationStepProps {
  navigation: any;
}

const EmailStepScreen: React.FC<VerificationStepProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const recoveryMutate = useRecoveryOne();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: { email: string }) => {
    recoveryMutate.mutate(
      data.email,
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: t("EmailStepScreen.codeSentTitle"),
            text2: t("EmailStepScreen.codeSentMessage")
          });
          navigation.navigate("RecoveryPasswordStep2");
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
      {/* Ícono */}
      <View style={styles.iconContainer}>
        <Mail size={32} color="#ff7f50" />
      </View>

      {/* Títulos */}
      <Text style={styles.title}>{t("EmailStepScreen.title")}</Text>
      <Text style={styles.subtitle}>{t("EmailStepScreen.subtitle")}</Text>

      {/* Campo de Email */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: t("EmailStepScreen.requiredField"),
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: t("auth.emailInvalid"),
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t("EmailStepScreen.emailLabel")}
              placeholder={t("EmailStepScreen.emailPlaceholder")}
              keyboardType="email-address"
              activeUnderlineColor="#ff7f50"
              textColor="black"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={!!errors.email} // Resalta si hay error
              style={styles.input}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>

      {/* Botones */}
      <View style={styles.buttonGroup}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.secondaryButton}
          icon={() => <ArrowLeft size={20} color="#FF7F50" />} // Ícono personalizado con color
          contentStyle={styles.secondaryButtonContent}
          labelStyle={styles.secondaryButtonText} // Color del texto
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
          {t("EmailStepScreen.sendCodeButton")}
        </Button>
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
  input: {
    marginBottom: 10,
    backgroundColor: "transparent",
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