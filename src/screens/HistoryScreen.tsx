import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Calendar, ChevronRight } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTransactionsHistory } from "../services/transactions";
import HistoryTransactionItem from "../components/ui/HistoryTransactionItem";
import generalStyles from "../styles/general";
import { Dialog, Portal, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

const History = () => {
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [page, setPage] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const { data, isLoading, refetch } = useTransactionsHistory(page, date ? date.toLocaleDateString() : null);

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
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowPicker(true)}>
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
      {showPicker && (
        Platform.OS === "ios" ? (
          <Portal>
            <Dialog
              visible={showPicker}
              onDismiss={() => setShowPicker(false)}
              theme={{ colors: { backdrop: "#00000040" } }}
            >
              <Dialog.Title>{t("common.selectADate")}</Dialog.Title>
              <Dialog.Content>
                <DateTimePicker
                  value={date ?? new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowPicker(false)}>{t("common.cancel")}</Button>
                <Button onPress={() => setShowPicker(false)}>{t("common.confirm")}</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        ) : (
          <DateTimePicker
            value={date ?? new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )
      )}
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
