import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Button, Card, IconButton } from "react-native-paper";
import { PlusCircle, CreditCard, Trash2, Edit2 } from "lucide-react-native";
import PaymentMethodForm from "../../components/ui/PaymentMethodForm";
import { useTranslation } from "react-i18next";
import { usePaymentMethods, useDeletePaymentMethod } from "../../services/paymentMethod";
import { PaymentMethod } from "../../types/paymentMethod";
import Toast from "react-native-toast-message";
import ConfirmationDialog from "../../components/ui/ConfirmationDialog";

const PaymentMethods: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>();
  const [itemDelete, setItemDelete] = useState<string | null>(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const { data: paymentMethods, isLoading, error } = usePaymentMethods();
  const deletePaymentMethod = useDeletePaymentMethod();

  const handleEdit = (method: PaymentMethod) => {
    console.log('Editando método:', method);
    setSelectedMethod(method);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedMethod(undefined);
    setOpen(true);
  };

  const onDelete = (id: string) => {
    console.log('Iniciando eliminación:', id);
    setItemDelete(id);
    setIsDeleteDialogVisible(true);
  };

  const handleDelete = () => {
    if (!itemDelete) return;

    console.log('Eliminando método:', itemDelete);
    deletePaymentMethod.mutate(itemDelete, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: t("alerts.deletedTitle"),
          text2: t("alerts.deletedMessage"),
        });
        setIsDeleteDialogVisible(false);
        setItemDelete(null);
      },
      onError: () => {
        setIsDeleteDialogVisible(false);
        Toast.show({
          type: "error",
          text1: t("alerts.errorTitle"),
          text2: t("alerts.errorMessage"),
        });
      }
    });
  };

  if (isLoading || deletePaymentMethod.isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7f50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("errors.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("methods.title")}</Text>
        <Button
          mode="contained"
          onPress={handleAdd}
          style={styles.addButton}
          icon={({ size, color }) => <PlusCircle size={size} color={color} />}
        >
          {t("methods.add")}
        </Button>
      </View>

      {paymentMethods && paymentMethods.length > 0 ? (
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <CreditCard size={24} color="#ff7f50" />
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.bank.name}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    <IconButton
                      icon={({ size, color }) => (
                        <Edit2 size={size} color={color} />
                      )}
                      onPress={() => handleEdit(item)}
                      style={styles.actionIcon}
                    />
                    <IconButton
                      icon={({ size, color }) => (
                        <Trash2 size={size} color={color} />
                      )}
                      onPress={() => onDelete(item._id)}
                      style={styles.actionIcon}
                    />
                  </View>
                </View>
                <View style={styles.cardContent}>
                  {item.method === "transferencia" ? (
                    <>
                      <Text style={styles.cardInfo}>
                        {t("methods.accountType")}:{" "}
                        <Text style={styles.cardInfoHighlight}>
                          {item.accountType}
                        </Text>
                      </Text>
                      <Text style={styles.cardInfo}>
                        {t("methods.accountNumber")}:{" "}
                        <Text style={styles.cardInfoHighlight}>
                          {item.accountNumber}
                        </Text>
                      </Text>
                      <Text style={styles.cardInfo}>
                        {t("methods.identityNumber")}:{" "}
                        <Text style={styles.cardInfoHighlight}>
                          {item.idNumber}
                        </Text>
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.cardInfo}>
                        {t("methods.type")}:{" "}
                        <Text style={styles.cardInfoHighlight}>
                          {t("methods.mobile")}
                        </Text>
                      </Text>
                      <Text style={styles.cardInfo}>
                        {t("methods.phoneNumber")}:{" "}
                        <Text style={styles.cardInfoHighlight}>
                          {item.phoneNumber}
                        </Text>
                      </Text>
                      <Text style={styles.cardInfo}>
                        {t("methods.identityNumber")}:{" "}
                        <Text style={styles.cardInfoHighlight}>
                          {item.idNumber}
                        </Text>
                      </Text>
                    </>
                  )}
                </View>
              </Card.Content>
            </Card>
          )}
        />
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.emptyState}>
              <CreditCard size={48} color="#aaa" />
              <Text style={styles.emptyText}>
                {t("methods.emptyMessage")}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
      <PaymentMethodForm
        visible={open}
        onDismiss={() => setOpen(false)}
        method={selectedMethod}
      />

      <ConfirmationDialog
        visible={isDeleteDialogVisible}
        message={t("alerts.deleteConfirmTitle")}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogVisible(false)}
      />
    </View>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 16,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#ff7f50",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardIcon: {
    backgroundColor: "#ffe5d1",
    padding: 10,
    borderRadius: 24,
  },
  cardDetails: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardActions: {
    flexDirection: "row",
  },
  actionIcon: {
    backgroundColor: "transparent",
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  cardInfo: {
    fontSize: 14,
    color: "#666",
  },
  cardInfoHighlight: {
    color: "#333",
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});