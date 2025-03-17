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

interface VerificationStepProps {
  navigation: any; // Tipo para navegación (puedes tiparlo mejor según tu configuración de navegación)
}

const VerificationStep: React.FC<VerificationStepProps> = ({ navigation }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleVerificationSubmit = () => {
    if (verificationCode.length !== 6) {
      Alert.alert("Código inválido", "El código debe tener 6 dígitos.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert(
        "Campos requeridos",
        "Por favor completa todos los campos."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Las contraseñas no coinciden",
        "Por favor verifica que las contraseñas sean iguales."
      );
      return;
    }

    // Simular éxito de actualización
    Alert.alert(
      "Éxito",
      "Tu contraseña ha sido actualizada correctamente.",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"), // Redirigir a la pantalla de inicio de sesión
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifica tu identidad</Text>
      <Text style={styles.subtitle}>
        Ingresa el código de 6 dígitos enviado a tu correo electrónico
      </Text>

      {/* Código de verificación usando InputOTP */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Código de verificación</Text>
        <InputOTP
          value={verificationCode}
          length={6}
          onChangeText={setVerificationCode}
          containerStyle={styles.otpContainer}
          inputStyle={styles.otpSlot}
        />
      </View>

      {/* Nueva contraseña */}
      <View style={styles.passwordInputContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.input, styles.textInputWithIcon]}
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nueva contraseña"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} color="#ff7f50" /> : <Eye size={20} color="#ff7f50" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmar contraseña */}
      <View style={styles.passwordInputContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.input, styles.textInputWithIcon]}
            secureTextEntry={!showPasswordConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirmar contraseña"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
          >
            {showPasswordConfirm ? <EyeOff size={20} color="#ff7f50" /> : <Eye size={20} color="#ff7f50" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#FF7F50" />
          <Text style={styles.buttonTextSecondary}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleVerificationSubmit}
        >
          <Text style={styles.buttonTextPrimary}>Actualizar</Text>
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
