import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Receipt } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { usePendingPayments } from "../../services/adminPayments";
import { useUser } from "../../context/UserContext";
import { isAdminRole } from "../../utils/roles";
import type { AdminPayment } from "../../types/adminPayments";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import generalStyles from "../../styles/general";

function personName(person?: { name?: string; lastName?: string; email?: string } | null) {
  if (!person) return "-";
  const name = `${person.name || ""} ${person.lastName || ""}`.trim();
  return name || person.email || "-";
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

const PendingPaymentsScreen = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const { user } = useUser();
  const isAdmin = isAdminRole(user?.user.role);
  const { data, isLoading, isFetching, refetch } = usePendingPayments();

  React.useEffect(() => {
    if (!isAdmin) navigation.goBack();
  }, [isAdmin, navigation]);

  if (!isAdmin) return null;

  const items = data?.results ?? [];

  const renderItem = ({ item }: { item: AdminPayment }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate("PendingPaymentDetail", { id: item._id })}
      activeOpacity={0.75}
    >
      <View style={styles.rowHeader}>
        <Text style={styles.sanName}>{item.san?.name || "-"}</Text>
        <Text style={styles.amount}>${item.amount}</Text>
      </View>
      <Text style={styles.payer}>{personName(item.user)}</Text>
      <View style={styles.rowFooter}>
        <Text style={styles.meta}>
          {t("PendingPayments.reference")}: {item.operationReference}
        </Text>
        <Text style={styles.meta}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FullScreenLoader visible={isLoading} />
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={items.length ? styles.list : styles.emptyList}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => void refetch()}
            colors={["#ff7f50"]}
            tintColor="#ff7f50"
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Receipt size={32} color="#ff7f50" />
              </View>
              <Text style={styles.emptyTitle}>{t("PendingPayments.emptyTitle")}</Text>
              <Text style={styles.emptyText}>{t("PendingPayments.emptyMessage")}</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default PendingPaymentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyList: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  row: {
    ...generalStyles.card,
    marginBottom: 0,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sanName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ff7f50",
  },
  payer: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
  },
  rowFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    fontSize: 12,
    color: "#888",
  },
  separator: {
    height: 12,
  },
  empty: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ffe4cf",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
