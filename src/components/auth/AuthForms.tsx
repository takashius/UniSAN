import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useUser } from '../../context/UserContext';
import { Button, TextInput } from 'react-native-paper';
import { useLogin, useRegister, useAccount } from '../../services/auth';
import Toast from 'react-native-toast-message';
import errorToast from '../ui/ErrorToast';
import SecureStoreManager from '../AsyncStorageManager';

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const { login } = useUser();
  const loginMutate = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);
  const { refetch, isFetching } = useAccount();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<{ email: string; password: string }>();

  const onSubmit = (data: { email: string; password: string }) => {
    loginMutate.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: async (responseData) => {
          await SecureStoreManager.setItem<string>("Token", responseData.token);
          const user = await refetch();
          if (user.data) {
            login(user.data);
            Toast.show({
              type: 'success',
              text1: t("auth.loginSuccessTitle"),
              text2: t("auth.loginSuccessMessage")
            });
          } else {
            Toast.show({
              type: 'error',
              text1: t("auth.loginErrorTitle"),
              text2: t("auth.loginErrorMessage")
            });
          }
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: t("auth.loginErrorTitle"),
            text2: `${errorToast(error)}}`
          });
          console.log('Error al hacer login:', error)
        }
      }
    );
  };

  return (
    <View style={styles.container}>
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
              error={errors.email ? true : false}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>
            {String(errors.email.message)}
          </Text>
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
                label={t("auth.passwordPlaceholder")}
                value={value}
                onChangeText={onChange}
                activeUnderlineColor="#ff7f50"
                textColor="black"
                secureTextEntry={!showPassword}
                right={showPassword ?
                  <TextInput.Icon icon="eye" color={'#ff7f50'} onPress={() => setShowPassword(!showPassword)} />
                  : <TextInput.Icon icon="eye-off" color={'#ff7f50'} onPress={() => setShowPassword(!showPassword)} />}
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

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("RecoveryPasswordStep1");
          }}
        >
          <Text style={styles.link}>{t("auth.forgotPasswordLink")}</Text>
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        style={styles.button}
        contentStyle={styles.buttonContent}
        onPress={handleSubmit(onSubmit)}
        loading={loginMutate.isPending || isFetching}
        icon={({ size, color }) => (
          <ArrowRight size={size} color={color} />
        )}
      >
        {t("auth.loginButton")}
      </Button>

    </View>
  );
};

export const RegisterForm = () => {
  const { t } = useTranslation();
  const registerMutate = useRegister();
  const { login } = useUser();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const { refetch, isFetching } = useAccount();

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
    },
  });

  const password = watch("password"); // Observar el valor de "password"

  const onSubmit = (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    registerMutate.mutate(
      { name: data.name, email: data.email, password: data.password },
      {
        onSuccess: async (response) => {
          await SecureStoreManager.setItem<string>("Token", response.token);
          const user = await refetch();
          if (user.data) {
            login(user.data);
            Toast.show({
              type: 'success',
              text1: t("auth.registerSuccessTitle"),
              text2: t("auth.registerSuccessMessage")
            });
          } else {
            Toast.show({
              type: 'error',
              text1: t("auth.registerErrorTitle"),
              text2: t("auth.registerErrorMessage")
            });
          }
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: t("auth.registerErrorTitle"),
            text2: `${errorToast(error)}`
          });
          console.log('Error al registrarse:', error)
        },
      }
    );
  };

  return (
    <View style={styles.container}>
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
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
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
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
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
              right={showPassword ?
                <TextInput.Icon icon="eye" color={'#ff7f50'} onPress={() => setShowPassword(!showPassword)} />
                : <TextInput.Icon icon="eye-off" color={'#ff7f50'} onPress={() => setShowPassword(!showPassword)} />}
              style={styles.input}
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
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
              right={showPasswordConfirm ?
                <TextInput.Icon icon="eye" color={'#ff7f50'} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} />
                : <TextInput.Icon icon="eye-off" color={'#ff7f50'} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} />}
              style={styles.input}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}
      </View>

      {/* Botón de Registro */}
      <Button
        mode="contained"
        style={styles.button}
        contentStyle={styles.buttonContent}
        onPress={handleSubmit(onSubmit)}
        loading={registerMutate.isPending}
        icon={({ size, color }) => (
          <ArrowRight size={size} color={color} />
        )}
      >
        {t("auth.registerButton")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    color: "black"
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  icon: {
    position: 'absolute',
    right: 12,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: "25%",
  },
  link: {
    marginTop: 8,
    fontSize: 12,
    color: '#ff7f50',
    textDecorationLine: 'underline',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff7f50',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
