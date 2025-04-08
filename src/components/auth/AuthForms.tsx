import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRegister } from '../../services/auth';
import { useUser } from '../../context/UserContext';
import { Button, TextInput } from 'react-native-paper';
import { useLogin } from '../../services/auth';
import Toast from 'react-native-toast-message';

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const { login } = useUser();
  const loginMutate = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  // RHF: Configurar useForm
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<{ email: string; password: string }>();

  const onSubmit = (data: { email: string; password: string }) => {
    console.log(data)
    loginMutate.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (responseData) => {
          login({
            email: data.email,
            name: responseData.name,
            lastName: responseData.lastName,
            photo: responseData.photo,
            token: responseData.token,
          });
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `${error}`
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

      {/* Campo de contraseña */}
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

        {/* Enlace para restablecer contraseña */}
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
        loading={loginMutate.isPending}
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const registerMutate = useRegister();

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      Alert.alert(t("auth.registerErrorTitle"), t("auth.passwordMismatchMessage"));
      return;
    }

    if (name && email && password) {
      registerMutate.mutate({ name, email, password }, {
        onSuccess: (data) => {
        }
      });
    } else {
      Alert.alert(t("auth.registerErrorTitle"), t("auth.registerErrorMessage"));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("auth.nameLabel")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("auth.namePlaceholder")}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("auth.emailLabel")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("auth.passwordLabel")}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 48 }]}
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            {showPassword ? (
              <EyeOff size={24} color="#ff7f50" />
            ) : (
              <Eye size={24} color="#ff7f50" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("auth.confirmPasswordLabel")}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 48 }]}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPasswordConfirm}
          />
          <TouchableOpacity
            onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
            style={styles.eyeButton}
          >
            {showPasswordConfirm ? (
              <EyeOff size={24} color="#ff7f50" />
            ) : (
              <Eye size={24} color="#ff7f50" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>{t("auth.registerButton")}</Text>
        <ArrowRight size={24} color="white" />
      </TouchableOpacity>
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
