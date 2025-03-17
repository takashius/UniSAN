import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import SANCard from "../components/ui/SANCard";
import UserLevel from "../components/ui/UserLevel";

// Datos de ejemplo
const mockSANs = [
  {
    id: "1",
    name: "SAN Básico",
    amount: 100,
    period: "Semanal",
    participants: 8,
    maxParticipants: 10,
    nextDate: "15 mayo",
    hasOpenSpot: true,
  },
  {
    id: "2",
    name: "SAN Quincenal",
    amount: 200,
    period: "Quincenal",
    participants: 10,
    maxParticipants: 10,
    nextDate: "22 mayo",
  },
];

const HomeScreen = () => {
  return (
    <View style={styles.container}>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Welcome Section */}
        <Animated.View style={styles.glassCard} entering={FadeInDown.duration(400)}>
          <Text style={styles.welcomeTitle}>
            Bienvenido de nuevo, <Text style={styles.highlight}>María</Text>
          </Text>
          <Text style={styles.welcomeText}>Tienes 2 SANs activos y un pago próximo en 3 días.</Text>
        </Animated.View>

        <UserLevel level={1} points={60} nextLevelPoints={100} />

        {/* Active SANs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus SANs activos</Text>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>Ver todos</Text>
              <ChevronRight size={16} color="#ff7f50" />
            </TouchableOpacity>
          </View>
          {mockSANs.map((san, index) => (
            <Animated.View
              key={san.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
              style={{ marginBottom: 16 }}
            >
              <SANCard key={san.id} {...san} />
            </Animated.View>
          ))}
        </View>

        {/* Upcoming Payments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos pagos</Text>
          </View>

          <Animated.View style={styles.paymentCard} entering={FadeInDown.delay(200).duration(500)}>
            <View style={styles.paymentCardHeader}>
              <View>
                <Text style={styles.cardTitle}>SAN Básico</Text>
                <Text style={styles.cardSubtitle}>Turno 3 de 10</Text>
              </View>
              <Text style={styles.cardAmount}>$100</Text>
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.detailsLabel}>Fecha de pago:</Text>
              <Text style={styles.detailsValue}>15 mayo, 2023</Text>
            </View>
            <TouchableOpacity style={styles.paymentButton}>
              <Text style={styles.buttonText}>Realizar pago anticipado</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6", // Fondo claro similar al bg-san-light-gray
  },
  mainContent: {
    padding: 16,
  },
  glassCard: {
    backgroundColor: "#ffffff", // Color semitransparente
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  highlight: {
    color: "#ff7f50", // Color similar a text-san-orange
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: "#ff7f50",
    fontSize: 14,
    marginRight: 4,
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#888",
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff7f50",
  },
  paymentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailsLabel: {
    fontSize: 12,
    color: "#888",
  },
  detailsValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  paymentButton: {
    backgroundColor: "#ff7f50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
