import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Calendar, ChevronRight } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTransactionsHistory } from "../services/transactions";
import HistoryTransactionItem from "../components/ui/HistoryTransactionItem";
import generalStyles from "../styles/general";

const History = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useTransactionsHistory(page);

  return (
    <View style={styles.container}>

      {isLoading && (
        <View style={generalStyles.loaderContainer}>
          <ActivityIndicator size="large" color="#ff4d4d" />
        </View>
      )}

      <ScrollView contentContainerStyle={generalStyles.mainContent}>
        <View style={generalStyles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("ActivityScreen.recentActivity")}</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Calendar size={16} color="#ff7f50" />
              <Text style={styles.filterText}>{t("ActivityScreen.filterByDate")}</Text>
            </TouchableOpacity>
          </View>

          <Animated.View entering={FadeIn.duration(400)} style={generalStyles.card}>
            {data?.transactions && data.transactions.length > 0 &&
              <View>
                {data?.transactions.map((item, index) => (
                  <HistoryTransactionItem
                    key={item._id + index}
                    item={item}
                  />
                ))}
              </View>
            }
          </Animated.View>
        </View>

        <View style={generalStyles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("ActivityScreen.completedSANs")}</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>{t("ActivityScreen.viewAll")}</Text>
              <ChevronRight size={16} color="#ff7f50" />
            </TouchableOpacity>
          </View>

          <View style={styles.noContent}>
            <View style={styles.noContentIcon}>
              <Calendar size={32} color="#ff7f50" />
            </View>
            <Text style={styles.noContentTitle}>
              {t("ActivityScreen.noCompletedSANs")}
            </Text>
            <Text style={styles.noContentText}>
              {t("ActivityScreen.noCompletedSANsMessage")}
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
