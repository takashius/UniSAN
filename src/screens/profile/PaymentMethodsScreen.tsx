import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { Button, Card, IconButton } from "react-native-paper";
import { PlusCircle, CreditCard, Trash2 } from "lucide-react-native";
import PaymentMethodForm from "../../components/ui/PaymentMethodForm";
import { useTranslation } from "react-i18next";

type PaymentMethodType = "movil" | "transferencia";

interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  title: string;
  bank: string;
  accountNumber?: string;
  accountType?: string;
  identityNumber: string;
  phoneNumber?: string;
}

const PaymentMethods: React.FC = () => {
  const { t } = useTranslation(); // Hook para traducir

  const [open, setOpen] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "transferencia",
      title: t("methods.mainAccount"), // Traducción de "Cuenta Principal"
      bank: "Banesco",
      accountNumber: "01340123456789012345",
      accountType: "corriente",
      identityNumber: "V-12345678",
    },
    {
      id: "2",
      type: "movil",
      title: t("methods.mobilePayment"), // Traducción de "Pago Móvil Personal"
      bank: "Mercantil",
      identityNumber: "V-12345678",
      phoneNumber: "04141234567",
    },
  ]);

  const handleDelete = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    Alert.alert(
      t("alerts.deletedTitle"), // Traducción de "Método de pago eliminado"
      t("alerts.deletedMessage") // Traducción de "Tu método de pago ha sido eliminado exitosamente."
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("methods.title")}</Text>
        <Button
          mode="contained"
          onPress={() => setOpen(true)}
          style={styles.addButton}
          icon={({ size, color }) => <PlusCircle size={size} color={color} />}
        >
          {t("methods.add")}
        </Button>
      </View>

      {paymentMethods.length > 0 ? (
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <CreditCard size={24} color="#ff7f50" />
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.bank}</Text>
                  </View>
                  <IconButton
                    icon={({ size, color }) => (
                      <Trash2 size={size} color={color} />
                    )}
                    onPress={() => handleDelete(item.id)}
                    style={styles.trashIcon}
                  />
                </View>
                <View style={styles.cardContent}>
                  {item.type === "transferencia" ? (
                    <>
                      <Text style={styles.cardInfo}>
                        {t("methods.accountType")}:{" "}
                        <Text style={styles.cardInfoHighlight}>
                          {item.accountType === "corriente"
                            ? t("methods.current")
                            : t("methods.savings")}
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
                          {item.identityNumber}
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
                          {item.identityNumber}
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
      <PaymentMethodForm visible={open} onDismiss={() => setOpen(false)} />
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
  trashIcon: {
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