import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { TextInput as PaperTextInput } from "react-native-paper";
import type { AuthStackParamList } from "../../types/navigation";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useUser } from "../../context/UserContext";
import { Button, Checkbox, TextInput } from "react-native-paper";
import { useLogin, useRegister, useAccount } from "../../services/auth";
import Toast from "react-native-toast-message";
import errorToast from "../ui/ErrorToast";
import SecureStoreManager from "../AsyncStorageManager";
import FullScreenLoader from "../ui/FullScreenLoader";
import { registerAndSyncPushToken } from "../../services/notifications";

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const { login } = useUser();
  const loginMutate = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);
  const [completingLogin, setCompletingLogin] = React.useState(false);
  const [hasRememberedEmail, setHasRememberedEmail] = React.useState(false);
  const passwordInputRef = React.useRef<PaperTextInput>(null);
  const { refetch } = useAccount();
  const isBusy = loginMutate.isPending || completingLogin;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ email: string; password: string; rememberEmail: boolean }>({
    defaultValues: {
      email: "",
      password: "",
      rememberEmail: true,
    },
  });

  React.useEffect(() => {
    let cancelled = false;
    const loadRememberedEmail = async () => {
      const saved = await SecureStoreManager.getItem<string>("rememberedEmail");
      if (cancelled || !saved) return;
      setValue("email", saved);
      setValue("rememberEmail", true);
      setHasRememberedEmail(true);
      requestAnimationFrame(() => {
        passwordInputRef.current?.focus();
      });
    };
    void loadRememberedEmail();
    return () => {
      cancelled = true;
    };
  }, [setValue]);

  const persistRememberedEmail = async (email: string, remember: boolean) => {
    if (remember) {
      await SecureStoreManager.setItem("rememberedEmail", email.trim());
    } else {
      await SecureStoreManager.removeItem("rememberedEmail");
    }
  };

  const onSubmit = (data: {
    email: string;
    password: string;
    rememberEmail: boolean;
  }) => {
    setCompletingLogin(true);
    void persistRememberedEmail(data.email, data.rememberEmail);
    loginMutate.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: async (responseData) => {
          try {
            await SecureStoreManager.setItem<string>(
              "Token",
              responseData.token,
            );
            const user = await refetch();
            if (user.data) {
              login(user.data);
              void registerAndSyncPushToken();
              Toast.show({
                type: "success",
                text1: t("auth.loginSuccessTitle"),
                text2: t("auth.loginSuccessMessage"),
              });
            } else {
              setCompletingLogin(false);
              Toast.show({
                type: "error",
                text1: t("auth.loginErrorTitle"),
                text2: t("auth.loginErrorMessage"),
              });
            }
          } catch {
            setCompletingLogin(false);
          }
        },
        onError: (error) => {
          setCompletingLogin(false);
          Toast.show({
            type: "error",
            text1: t("auth.loginErrorTitle"),
            text2: `${errorToast(error)}}`,
          });
          console.warn("Error al hacer login:", error);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <FullScreenLoader visible={isBusy} />
      {/* Campo de correo */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: t("auth.emailRequired"),
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: t("auth.emailInvalid"),
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={t("auth.emailLabel")}
              value={value}
              activeUnderlineColor="#ff7f50"
              textColor="black"
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="username"
              error={errors.email ? true : false}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{String(errors.email.message)}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.passwordContainer}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: t("auth.passwordRequired"),
              minLength: {
                value: 7,
                message: t("auth.passwordMinLength"),
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                ref={passwordInputRef}
                label={t("auth.passwordPlaceholder")}
                value={value}
                onChangeText={onChange}
                activeUnderlineColor="#ff7f50"
                textColor="black"
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="password"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={hasRememberedEmail}
                right={
                  showPassword ? (
                    <TextInput.Icon
                      icon="eye"
                      color={"#ff7f50"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <TextInput.Icon
                      icon="eye-off"
                      color={"#ff7f50"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  )
                }
                style={styles.input}
                error={errors.password ? true : false}
              />
            )}
          />
        </View>
        {errors.password && (
          <Text style={styles.errorText}>
            {String(errors.password.message)}
          </Text>
        )}

        <View style={styles.optionsRow}>
          <Controller
            control={control}
            name="rememberEmail"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => onChange(!value)}
                activeOpacity={0.7}
              >
                <Checkbox
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#ff7f50"
                  uncheckedColor="#888888"
                />
                <Text style={styles.rememberLabel}>
                  {t("auth.rememberUser")}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("RecoveryPasswordStep1");
            }}
          >
            <Text style={styles.link}>{t("auth.forgotPasswordLink")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        mode="contained"
        style={styles.button}
        contentStyle={styles.buttonContent}
        onPress={handleSubmit(onSubmit)}
        disabled={isBusy}
        icon={({ size, color }) => <ArrowRight size={size} color={color} />}
      >
        {t("auth.loginButton")}
      </Button>
    </View>
  );
};

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const registerMutate = useRegister();
  const { login } = useUser();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const { refetch } = useAccount();
  const [completingRegister, setCompletingRegister] = React.useState(false);
  const isBusy = registerMutate.isPending || completingRegister;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
  }) => {
    setCompletingRegister(true);
    registerMutate.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        acceptedTerms: data.acceptedTerms,
      },
      {
        onSuccess: async (response) => {
          try {
            await SecureStoreManager.setItem<string>("Token", response.token);
            const user = await refetch();
            if (user.data) {
              login(user.data);
              void registerAndSyncPushToken();
              Toast.show({
                type: "success",
                text1: t("auth.registerSuccessTitle"),
                text2: t("auth.registerSuccessMessage"),
              });
            } else {
              setCompletingRegister(false);
              Toast.show({
                type: "error",
                text1: t("auth.registerErrorTitle"),
                text2: t("auth.registerErrorMessage"),
              });
            }
          } catch {
            setCompletingRegister(false);
          }
        },
        onError: (error) => {
          setCompletingRegister(false);
          Toast.show({
            type: "error",
            text1: t("auth.registerErrorTitle"),
            text2: `${errorToast(error)}`,
          });
          console.warn("Error al registrarse:", error);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <FullScreenLoader visible={isBusy} />
      {/* Campo de Nombre */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: t("auth.nameRequired"),
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("auth.nameLabel")}
              value={value}
              activeUnderlineColor="#ff7f50"
              textColor="black"
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}
      </View>

      {/* Campo de Email */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: t("auth.emailRequired"),
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: t("auth.emailInvalid"),
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("auth.emailLabel")}
              value={value}
              activeUnderlineColor="#ff7f50"
              textColor="black"
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>

      {/* Campo de Contraseña */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: t("auth.passwordRequired"),
            minLength: {
              value: 7,
              message: t("auth.passwordMinLength"),
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("auth.passwordLabel")}
              value={value}
              activeUnderlineColor="#ff7f50"
              textColor="black"
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              right={
                showPassword ? (
                  <TextInput.Icon
                    icon="eye"
                    color={"#ff7f50"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <TextInput.Icon
                    icon="eye-off"
                    color={"#ff7f50"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                )
              }
              style={styles.input}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
      </View>

      {/* Confirmar Contraseña */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: t("auth.passwordRequired"),
            validate: (value) =>
              value === password || t("auth.passwordMismatchMessage"),
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("auth.confirmPasswordLabel")}
              value={value}
              activeUnderlineColor="#ff7f50"
              textColor="black"
              onChangeText={onChange}
              secureTextEntry={!showPasswordConfirm}
              right={
                showPasswordConfirm ? (
                  <TextInput.Icon
                    icon="eye"
                    color={"#ff7f50"}
                    onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  />
                ) : (
                  <TextInput.Icon
                    icon="eye-off"
                    color={"#ff7f50"}
                    onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  />
                )
              }
              style={styles.input}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="acceptedTerms"
          rules={{
            validate: (value) =>
              value === true || t("auth.acceptTermsRequired"),
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.termsRow}>
              <Checkbox
                status={value ? "checked" : "unchecked"}
                onPress={() => onChange(!value)}
                color="#ff7f50"
              />
              <Text style={styles.termsLabel}>
                {t("auth.acceptTermsLabel")}{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => navigation.navigate("Terms")}
                >
                  {t("auth.termsLink")}
                </Text>
              </Text>
            </View>
          )}
        />
        {errors.acceptedTerms && (
          <Text style={styles.errorText}>
            {String(errors.acceptedTerms.message)}
          </Text>
        )}
      </View>

      {/* Botón de Registro */}
      <Button
        mode="contained"
        style={styles.button}
        contentStyle={styles.buttonContent}
        onPress={handleSubmit(onSubmit)}
        disabled={isBusy}
        icon={({ size, color }) => <ArrowRight size={size} color={color} />}
      >
        {t("auth.registerButton")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    color: "black",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  icon: {
    position: "absolute",
    right: 12,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: "25%",
  },
  optionsRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -8,
  },
  rememberLabel: {
    fontSize: 13,
    color: "#333333",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: -8,
  },
  termsLabel: {
    flex: 1,
    fontSize: 13,
    color: "#333333",
    paddingTop: 8,
  },
  termsLink: {
    color: "#ff7f50",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  link: {
    fontSize: 12,
    color: "#ff7f50",
    textDecorationLine: "underline",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff7f50",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "bold",
  },
  buttonContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
});
