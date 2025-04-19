import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import {
  Button,
  Card,
  Dialog,
  Portal,
  IconButton,
} from "react-native-paper";
import { PlusCircle, CreditCard, Trash2 } from "lucide-react-native";
import PaymentMethodForm from "../../components/ui/PaymentMethodForm";

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
  const [open, setOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentMethodType>(
    "transferencia"
  );
  const [title, setTitle] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("corriente");
  const [identityNumber, setIdentityNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "transferencia",
      title: "Cuenta Principal",
      bank: "Banesco",
      accountNumber: "01340123456789012345",
      accountType: "corriente",
      identityNumber: "V-12345678",
    },
    {
      id: "2",
      type: "movil",
      title: "Pago Móvil Personal",
      bank: "Mercantil",
      identityNumber: "V-12345678",
      phoneNumber: "04141234567",
    },
  ]);

  const handleSubmit = () => {
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: paymentType,
      title,
      bank,
      identityNumber,
      ...(paymentType === "transferencia"
        ? { accountNumber, accountType }
        : { phoneNumber }),
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);

    // Reset form
    setTitle("");
    setBank("");
    setAccountNumber("");
    setAccountType("corriente");
    setIdentityNumber("");
    setPhoneNumber("");

    setOpen(false);

    Alert.alert("Método de pago agregado", "Tu método de pago ha sido agregado exitosamente.");
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    Alert.alert("Método de pago eliminado", "Tu método de pago ha sido eliminado exitosamente.");
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tus métodos de pago</Text>
          <Button
            mode="contained"
            onPress={() => setOpen(true)}
            style={styles.addButton}
          >
            <PlusCircle size={20} color="#fff" />
            Agregar
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
                          Tipo de cuenta:{" "}
                          <Text style={styles.cardInfoHighlight}>
                            {item.accountType === "corriente"
                              ? "Corriente"
                              : "Ahorro"}
                          </Text>
                        </Text>
                        <Text style={styles.cardInfo}>
                          Número de cuenta:{" "}
                          <Text style={styles.cardInfoHighlight}>
                            {item.accountNumber}
                          </Text>
                        </Text>
                        <Text style={styles.cardInfo}>
                          Cédula:{" "}
                          <Text style={styles.cardInfoHighlight}>
                            {item.identityNumber}
                          </Text>
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.cardInfo}>
                          Tipo:{" "}
                          <Text style={styles.cardInfoHighlight}>Pago Móvil</Text>
                        </Text>
                        <Text style={styles.cardInfo}>
                          Teléfono:{" "}
                          <Text style={styles.cardInfoHighlight}>
                            {item.phoneNumber}
                          </Text>
                        </Text>
                        <Text style={styles.cardInfo}>
                          Cédula:{" "}
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
                  No tienes métodos de pago registrados. Agrega uno para facilitar tus pagos en
                  los SANs.
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      <PaymentMethodForm visible={open} onDismiss={() => setOpen(false)} />
    </View>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContent: {
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