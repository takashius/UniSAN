import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const LoginForm = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (email && password) {
      Alert.alert("Inicio de sesión exitoso", "Bienvenido a UniSAN.");
    } else {
      Alert.alert("Error en el inicio de sesión", "Por favor, revisa tus credenciales.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@correo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 48 }]} // Espacio adicional para el ícono
            placeholder="Contraseña"
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

        <TouchableOpacity onPress={() => {
          // @ts-ignore
          navigation.navigate('RecoveryPasswordStep1')
        }}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
        <ArrowRight size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error en el registro", "Las contraseñas no coinciden.");
      return;
    }

    if (name && email && password) {
      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente.");
    } else {
      Alert.alert("Error en el registro", "Por favor, completa todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@correo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 48 }]}
            placeholder="Contraseña"
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
        <Text style={styles.label}>Confirmar contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 48 }]}
            placeholder="Confirmar contraseña"
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
        <Text style={styles.buttonText}>Crear cuenta</Text>
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
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: "100%",
    backgroundColor: "#f9f9f9",
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
    top: "25%", // Centra el botón verticalmente en relación al TextInput
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
});
