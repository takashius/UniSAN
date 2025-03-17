import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Camera, Edit2, ChevronRight, LogOut, Settings, CreditCard } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import UserLevel from "../components/ui/UserLevel";

const Profile: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card de Perfil */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>MG</Text>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.profileRow}>
                <Text style={styles.profileName}>María González</Text>
                <TouchableOpacity>
                  <Edit2 size={16} color="#888" />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileEmail}>maria.gonzalez@ejemplo.com</Text>
              <Text style={styles.profileLevel}>Nivel 1 · Inicial</Text>
            </View>
          </View>
        </Animated.View>

        {/* Sección de Nivel */}
        <View style={styles.section}>
          <UserLevel level={1} points={60} nextLevelPoints={100} />
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>SANs participados</Text>
              <Text style={styles.statValue}>2</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Pagos a tiempo</Text>
              <Text style={styles.statValue}>4/4</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>SANs completados</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total ahorrado</Text>
              <Text style={styles.statValueOrange}>$400</Text>
            </View>
          </Animated.View>
        </View>

        {/* Configuración */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <Animated.View entering={FadeIn.duration(400).delay(200)} style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemRow}>
                <CreditCard size={20} color="#ff7f50" />
                <Text style={styles.settingsItemText}>Métodos de pago</Text>
              </View>
              <ChevronRight size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemRow}>
                <Settings size={20} color="#ff7f50" />
                <Text style={styles.settingsItemText}>Preferencias</Text>
              </View>
              <ChevronRight size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingsItem, styles.logoutItem]}>
              <LogOut size={20} color="#ff4d4d" />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#ffe4cf",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff7f50",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff7f50",
    borderRadius: 16,
    padding: 6,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
  },
  profileLevel: {
    fontSize: 14,
    color: "#ff7f50",
    fontWeight: "500",
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap", // Asegura el diseño en cuadrícula
    justifyContent: "space-between", // Distribución horizontal
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "48%", // Ocupa casi la mitad del ancho para cuadrícula
    marginBottom: 16, // Espaciado entre filas
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statValueOrange: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff7f50",
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsItem: {
    flexDirection: "row", // Asegura que el icono y texto estén alineados
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  settingsItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsItemText: {
    fontSize: 16,
    marginLeft: 12, // Añade espacio entre el icono y el texto
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: "#ff4d4d",
    marginLeft: 12, // Añade espacio entre el icono y el texto
  },
});

