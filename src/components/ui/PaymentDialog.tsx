import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Dialog, Portal, HelperText } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import BankSelectField from "./BankSelectField";
import formStyles from "../../styles/FormStyles";
import { useTranslation } from "react-i18next";
import DateInputField from "./DatePickerForm";
import { useJoinSan, usePaymentSan } from "../../services/san";
import { PaymentDialogProps, PaymentFormData } from "../../types/payment";
import Toast from "react-native-toast-message";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../context/UserContext";

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, amount, san, isJoin = false, onDismiss, onPaymentRegistered }) => {
  const { control, handleSubmit, reset } = useForm<PaymentFormData>({
    defaultValues: {
      paymentDate: new Date(),
      amount: amount,
      referenceNumber: ''
    },
  });
  const { t } = useTranslation();
  const joinSan = useJoinSan();
  const paymentSan = usePaymentSan();
  const queryClient = useQueryClient();
  const { setUser } = useUser();

  const onSubmit = (data: PaymentFormData) => {
    const payload = {
      san,
      bank: data.sourceBank,
      amount: data.amount,
      operationReference: data.referenceNumber,
      date: data.paymentDate.toLocaleDateString()
    };
    if (isJoin) {
      joinSan.mutate(payload,
        {
          onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["availableSan"] });
            await queryClient.refetchQueries({ queryKey: ["myAccount"] });
            const updatedUser = await queryClient.ensureQueryData({ queryKey: ["myAccount"] });
            setUser(updatedUser);
            Toast.show({
              type: "success",
              text1: t("Payment.paymentSuccessTitle"),
              text2: t("Payment.paymentSuccessMessage"),
            });
          },
          onError: (error) => {
            console.log(error)
            Toast.show({
              type: "success",
              text1: t("Payment.paymentErrorTitle"),
              text2: t("Payment.paymentErrorMessage"),
            });
          },
        }
      );
    } else {
      paymentSan.mutate(payload,
        {
          onSuccess: async () => {
            Toast.show({
              type: "success",
              text1: t("Payment.paymentSuccessTitle"),
              text2: t("Payment.paymentSuccessMessage"),
            });
          },
          onError: (error) => {
            console.log(error)
            Toast.show({
              type: "success",
              text1: t("Payment.paymentErrorTitle"),
              text2: t("Payment.paymentErrorMessage"),
            });
          },
        }
      );
    }

    if (onPaymentRegistered) {
      onPaymentRegistered();
    }
    reset();
    onDismiss();
  };

  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={onDismiss}
        style={styles.dialog}
        theme={{ colors: { backdrop: "#ff7f50" } }}
      >
        <Dialog.Title style={styles.dialogTitle}>{t("Payment.title")}</Dialog.Title>
        <Dialog.Content>
          <View style={styles.paymentDetails}>
            <View style={styles.detailRow}>
              <HelperText type="info">{t("Payment.bank")}:</HelperText>
              <HelperText type="info">Bancamiga</HelperText>
            </View>
            <View style={styles.detailRow}>
              <HelperText type="info">{t("Payment.phone")}:</HelperText>
              <HelperText type="info">04125557916</HelperText>
            </View>
            <View style={styles.detailRow}>
              <HelperText type="info">{t("Payment.documentID")}:</HelperText>
              <HelperText type="info">13952494</HelperText>
            </View>
            <View style={styles.detailRow}>
              <HelperText type="info">{t("Payment.amountToPay")}:</HelperText>
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
                {error && <HelperText type="error">{t("methodsForm.requiredError")}</HelperText>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="paymentDate"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <DateInputField date={value} onChange={onChange} label={t("Payment.paymentDate")} />
                {error && <HelperText type="error">{t("methodsForm.requiredError")}</HelperText>}
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
                  label={t("Payment.amount")}
                  value={value ? value.toString() : amount.toString()}
                  activeUnderlineColor="#ff7f50"
                  textColor="black"
                  keyboardType="numeric"
                  placeholder={amount.toString()}
                  onChangeText={onChange}
                  style={formStyles.input}
                />
                {error && <HelperText type="error">{t("methodsForm.requiredError")}</HelperText>}
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
                  label={t("Payment.referenceNumber")}
                  value={value}
                  activeUnderlineColor="#ff7f50"
                  textColor="black"
                  keyboardType="numeric"
                  placeholder="Ej: 123456789"
                  onChangeText={onChange}
                  style={formStyles.input}
                />
                {error && <HelperText type="error">{t("methodsForm.requiredError")}</HelperText>}
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
            {t("common.cancel")}
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={formStyles.confirmButton}
            loading={joinSan.isPending}
          >
            {t("Payment.confirmPayment")}
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