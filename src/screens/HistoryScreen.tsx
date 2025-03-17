import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Calendar, ChevronRight } from "lucide-react-native";
import Animated, { FadeIn, FadeInLeft } from "react-native-reanimated";

const History: React.FC = () => {
  // Mock data - Esto representaría una llamada API en una app real
  const historyItems = [
    {
      id: "1",
      type: "payment",
      san: "SAN Básico",
      amount: 100,
      date: "1 mayo, 2023",
      status: "completed",
    },
    {
      id: "2",
      type: "payment",
      san: "SAN Quincenal",
      amount: 200,
      date: "30 abril, 2023",
      status: "completed",
    },
    {
      id: "3",
      type: "received",
      san: "SAN Básico",
      amount: 1000,
      date: "15 abril, 2023",
      status: "received",
    },
    {
      id: "4",
      type: "payment",
      san: "SAN Básico",
      amount: 100,
      date: "15 abril, 2023",
      status: "completed",
    },
    {
      id: "5",
      type: "payment",
      san: "SAN Quincenal",
      amount: 200,
      date: "15 abril, 2023",
      status: "completed",
    },
    {
      id: "6",
      type: "joined",
      san: "SAN Quincenal",
      date: "1 abril, 2023",
      status: "info",
    },
    {
      id: "7",
      type: "joined",
      san: "SAN Básico",
      date: "1 marzo, 2023",
      status: "info",
    },
  ];

  return (
    <View style={styles.container}>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Actividad Reciente */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividad reciente</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Calendar size={16} color="#ff7f50" />
              <Text style={styles.filterText}>Filtrar por fecha</Text>
            </TouchableOpacity>
          </View>

          <Animated.View entering={FadeIn.duration(400)} style={styles.card}>
            <View>
              {historyItems.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInLeft.delay(index * 50).duration(300)}
                  style={styles.historyItem}
                >
                  <View style={styles.historyItemHeader}>
                    <Text style={styles.historyItemTitle}>
                      {item.san}
                      {item.type === "joined" && " - Te uniste"}
                    </Text>
                    {item.type !== "joined" && (
                      <Text
                        style={[
                          styles.historyItemAmount,
                          item.type === "received"
                            ? styles.amountReceived
                            : styles.amountPaid,
                        ]}
                      >
                        {item.type === "received" ? "+" : "-"}${item.amount}
                      </Text>
                    )}
                  </View>
                  <View style={styles.historyItemFooter}>
                    <Text style={styles.historyItemDate}>{item.date}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        item.status === "completed" && styles.statusCompleted,
                        item.status === "received" && styles.statusReceived,
                        item.status === "info" && styles.statusInfo,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {item.status === "completed"
                          ? "Completado"
                          : item.status === "received"
                            ? "Recibido"
                            : "Info"}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* SANs Completados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SANs completados</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Ver todos</Text>
              <ChevronRight size={16} color="#ff7f50" />
            </TouchableOpacity>
          </View>

          <View style={styles.noContent}>
            <View style={styles.noContentIcon}>
              <Calendar size={32} color="#ff7f50" />
            </View>
            <Text style={styles.noContentTitle}>
              No hay SANs completados
            </Text>
            <Text style={styles.noContentText}>
              Cuando completes tu primer SAN, aparecerá aquí.
            </Text>
          </View>
        </View>
      </ScrollView>

    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 16
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterText: {
    color: "#ff7f50",
    marginLeft: 8,
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  historyItemAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  amountReceived: {
    color: "#10b981", // Verde
  },
  amountPaid: {
    color: "#ff7f50", // Naranja
  },
  historyItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyItemDate: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: "#d1fae5", // Verde claro
  },
  statusReceived: {
    backgroundColor: "#bfdbfe", // Azul claro
  },
  statusInfo: {
    backgroundColor: "#ffe4d4", // Naranja claro
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#ff7f50",
  },
  noContent: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noContentIcon: {
    backgroundColor: "#fde4cf",
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  noContentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  noContentText: {
    fontSize: 14,
    color: "#666",
  },
});
