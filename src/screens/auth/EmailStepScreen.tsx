import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react-native";

const EmailStepScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleSubmitEmail = () => {
    if (!email) {
      Alert.alert("Campo requerido", "Por favor ingresa tu correo electrónico");
      return;
    }

    // Lógica para enviar el código (simulado)
    Alert.alert("Código enviado", "Hemos enviado un código de verificación a tu correo");
    // @ts-ignore
    navigation.navigate("RecoveryPasswordStep2");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Mail size={32} color="#ff7f50" />
      </View>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo electrónico y te enviaremos un código de verificación.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@correo.com"
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
          <Text style={styles.buttonTextSecondary}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmitEmail}>
          <Text style={styles.buttonText}>Enviar código</Text>
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
