import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { LoginForm, RegisterForm } from "../components/auth/AuthForms";

const LoginScreen = () => {
  const handleDemoLogin = () => {
    Alert.alert("Demostración", "Accediste al modo de demostración.");
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con el texto principal */}
      <View style={styles.header}>
        <Text style={styles.title}>UNISAN</Text>
        <Text style={styles.description}>
          La forma más fácil de gestionar tu sistema de ahorro colectivo
        </Text>
      </View>

      {/* Contenedor principal con contenido y footer */}
      <View style={styles.contentWrapper}>
        {/* Tabs para Login y Registro */}
        <View style={styles.tabsContainer}>
          <Tabs defaultValue="login">
            <TabsList>
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            {/* Contenido de Login */}
            <TabsContent value="login">
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <LoginForm />
                <TouchableOpacity onPress={handleDemoLogin} style={styles.demoLink}>
                  <Text style={styles.demoText}>Ver demostración sin iniciar sesión</Text>
                </TouchableOpacity>
              </ScrollView>
            </TabsContent>

            {/* Contenido de Registro */}
            <TabsContent value="register">
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <RegisterForm />
              </ScrollView>
            </TabsContent>
          </Tabs>
        </View>
      </View>

      {/* Pie de página */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 SAN Organizer. Todos los derechos reservados.</Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f1e7", // Fondo beige
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    paddingBottom: 5,
    marginTop: 24
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    maxWidth: 300,
  },
  contentWrapper: {
    flex: 1, // Ocupa el espacio disponible en la pantalla
  },
  tabsContainer: {
    flex: 1, // Asegura que el contenido ocupe espacio restante
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexGrow: 1, // Permite que el ScrollView se expanda
  },
  demoLink: {
    marginTop: 16,
    alignItems: "center",
  },
  demoText: {
    fontSize: 14,
    color: "#ff7f50", // Color naranja
    textDecorationLine: "underline",
  },
  footer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f1e7", // Mismo color que el fondo
  },
  footerText: {
    fontSize: 12,
    color: "#888888",
  },
});
