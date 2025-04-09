import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton, Button } from "react-native-paper";

const SANPlaceholder = () => {
  return (
    <View style={styles.container}>
      {/* Ícono dentro del círculo */}
      <View style={styles.iconCircle}>
        <IconButton
          icon="alert-circle-outline" // Ícono más acorde a "no ahorro"
          size={54} // Tamaño ajustado
        />
      </View>

      {/* Texto centrado */}
      <Text style={styles.secondaryText}>
        Aún no tienes ningún SAN activo.
      </Text>

      {/* Botón usando React Native Paper */}
      <Button
        mode="contained" // El botón tiene fondo sólido
        icon="magnify" // Ícono de lupa
        onPress={() => console.log("Explorar SANs")} // Acción del botón
        style={styles.button}
      >
        Explora nuevos SANs
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center", // Centra el contenido horizontalmente
  },
  iconCircle: {
    backgroundColor: "#f2f2f2", // Gris claro
    height: 72,
    width: 72,
    borderRadius: 36, // Hace el círculo perfecto
    justifyContent: "center", // Centra el ícono verticalmente
    alignItems: "center", // Centra el ícono horizontalmente
    marginBottom: 16, // Espaciado debajo del círculo
  },
  secondaryText: {
    textAlign: "center", // Centra el texto
    color: "#666666", // Color secundario
    fontSize: 16,
    marginBottom: 20, // Espaciado debajo del texto
  },
  button: {
    backgroundColor: "#ff7f50", // Naranja para el botón
    borderRadius: 8, // Bordes redondeados
    paddingHorizontal: 16, // Espaciado lateral
    paddingVertical: 6, // Espaciado vertical
  },
});

export default SANPlaceholder;