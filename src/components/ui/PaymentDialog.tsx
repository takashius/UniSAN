import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Dialog, Portal, HelperText } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import BankSelectField from "./BankSelectField";
import formStyles from "../../styles/FormStyles";

interface PaymentDialogProps {
  open: boolean;
  onDismiss: () => void;
  amount: number;
  onPaymentRegistered?: () => void;
}

interface PaymentFormData {
  sourceBank: string;
  paymentDate: string;
  amount: string;
  referenceNumber: string;
  proofImage?: FileList;
}

const BANKS = [
  "Bancamiga",
  "Banesco",
  "BBVA Provincial",
  "Banco de Venezuela",
  "Mercantil",
  "BOD",
  "BNC",
  "Banco del Tesoro",
];

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, amount, onDismiss, onPaymentRegistered }) => {
  const { control, handleSubmit, reset } = useForm<PaymentFormData>();

  const onSubmit = (data: PaymentFormData) => {
    console.log("Payment registered:", data);
    if (onPaymentRegistered) {
      onPaymentRegistered();
    }
    reset();
    onDismiss(); // Llamamos a `onDismiss` cuando se completa el pago
  };

  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={onDismiss}
        style={styles.dialog}
        theme={{ colors: { backdrop: "#ff7f50" } }}
      >
        <Dialog.Title style={styles.dialogTitle}>Datos de pago</Dialog.Title>
        <Dialog.Content>
          <View style={styles.paymentDetails}>
            <View style={styles.detailRow}>
              <HelperText type="info">Banco:</HelperText>
              <HelperText type="info">Bancamiga</HelperText>
            </View>
            <View style={styles.detailRow}>
              <HelperText type="info">Teléfono:</HelperText>
              <HelperText type="info">04125557916</HelperText>
            </View>
            <View style={styles.detailRow}>
              <HelperText type="info">Documento:</HelperText>
              <HelperText type="info">13952494</HelperText>
            </View>
            <View style={styles.detailRow}>
              <HelperText type="info">Monto a pagar:</HelperText>
              <HelperText type="info" style={styles.highlightAmount}>${amount}</HelperText>
            </View>
          </View>

          <Controller
            control={control}
            name="sourceBank"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <BankSelectField selectedBank={value} onSelectBank={onChange} />
                {error && <HelperText type="error">Este campo es obligatorio</HelperText>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="paymentDate"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TextInput
                  label="Fecha del pago"
                  value={value}
                  activeUnderlineColor="#ff7f50"
                  textColor="black"
                  placeholder="Selecciona la fecha"
                  onChangeText={onChange}
                  style={formStyles.input}
                />
                {error && <HelperText type="error">Este campo es obligatorio</HelperText>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="amount"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TextInput
                  label="Monto exacto"
                  value={value}
                  activeUnderlineColor="#ff7f50"
                  textColor="black"
                  keyboardType="numeric"
                  placeholder={amount.toString()}
                  onChangeText={onChange}
                  style={formStyles.input}
                />
                {error && <HelperText type="error">Este campo es obligatorio</HelperText>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="referenceNumber"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TextInput
                  label="Número de referencia"
                  value={value}
                  activeUnderlineColor="#ff7f50"
                  textColor="black"
                  placeholder="Ej: 123456789"
                  onChangeText={onChange}
                  style={formStyles.input}
                />
                {error && <HelperText type="error">Este campo es obligatorio</HelperText>}
              </View>
            )}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            textColor="#ff7f50"
            mode="outlined"
            onPress={onDismiss}
            style={formStyles.cancelButton}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={formStyles.confirmButton}>
            Confirmar pago
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};


export default PaymentDialog;

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "#fff",
  },
  dialogTitle: {
    color: "#ff7f50",
    fontSize: 18,
  },
  paymentDetails: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  highlightAmount: {
    color: "#ff7f50",
    fontWeight: "bold",
  }
});