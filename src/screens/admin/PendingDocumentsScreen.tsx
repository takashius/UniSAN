import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { IdCard } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../types/navigation";
import { useTranslation } from "react-i18next";
import { usePendingDocuments } from "../../services/adminDocuments";
import { useUser } from "../../context/UserContext";
import { isAdminRole } from "../../utils/roles";
import type { AdminDocument } from "../../types/adminDocuments";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import generalStyles from "../../styles/general";

function personName(item: AdminDocument) {
  const name = `${item.name || ""} ${item.lastName || ""}`.trim();
  return name || item.email || "-";
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

const PendingDocumentsScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { user } = useUser();
  const isAdmin = isAdminRole(user?.user.role);
  const { data, isLoading, isFetching, refetch } = usePendingDocuments();

  React.useEffect(() => {
    if (!isAdmin) navigation.goBack();
  }, [isAdmin, navigation]);

  if (!isAdmin) return null;

  const items = data ?? [];

  const renderItem = ({ item }: { item: AdminDocument }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() =>
        navigation.navigate("PendingDocumentDetail", { userId: item._id })
      }
      activeOpacity={0.75}
    >
      <Text style={styles.name}>{personName(item)}</Text>
      <Text style={styles.meta}>{item.documentId || item.email || "-"}</Text>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
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
                <IdCard size={32} color="#ff7f50" />
              </View>
              <Text style={styles.emptyTitle}>
                {t("PendingDocuments.emptyTitle")}
              </Text>
              <Text style={styles.emptyText}>
                {t("PendingDocuments.emptyMessage")}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default PendingDocumentsScreen;

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
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  meta: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
  },
  date: {
    marginTop: 8,
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
