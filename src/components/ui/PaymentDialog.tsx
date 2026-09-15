import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, ScrollView, Text, useWindowDimensions } from "react-native";
import { Button, TextInput, Portal, HelperText } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as Clipboard from "expo-clipboard";
import { Copy } from "lucide-react-native";
import BankSelectField from "./BankSelectField";
import formStyles from "../../styles/FormStyles";
import { useTranslation } from "react-i18next";
import DateInputField from "./DatePickerForm";
import { useJoinSan, usePaymentSan } from "../../services/san";
import { fetchAccount } from "../../services/auth";
import { useBcvRate, useReceivingAccounts } from "../../services/settings";
import { ReceivingAccount } from "../../types/settings";
import { PaymentDialogProps, PaymentFormData } from "../../types/payment";
import Toast from "react-native-toast-message";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../context/UserContext";
import { formatUsd, usdToBs } from "../../utils/fx";

const formatPagoMovilCopy = (account: ReceivingAccount, amount: number) => {
  const bankCode = String(account.bankCode || "").trim();
  const documentId = String(account.documentId || "").replace(/\D/g, "");
  const phone = String(account.phone || "").replace(/\D/g, "");
  const money = Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
  return `${bankCode}\n${documentId}\n${phone}\n${money}`;
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  amount,
  san,
  isJoin = false,
  onDismiss,
  onPaymentRegistered,
}) => {
  const { height } = useWindowDimensions();
  const { control, handleSubmit, reset, watch, setValue } = useForm<PaymentFormData>({
    defaultValues: {
      paymentDate: new Date(),
      amount: 0,
      referenceNumber: "",
    },
  });
  const { t } = useTranslation();
  const joinSan = useJoinSan();
  const paymentSan = usePaymentSan();
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const { data: receivingAccounts = [] } = useReceivingAccounts();
  const { data: fx, isError: fxError } = useBcvRate(open);
  const isPending = joinSan.isPending || paymentSan.isPending;
  const watchedAmount = Number(watch("amount"));
  const bsAmount = Number.isFinite(watchedAmount) && watchedAmount > 0 ? watchedAmount : null;

  useEffect(() => {
    if (!open) return;
    reset({
      paymentDate: new Date(),
      amount: 0,
      referenceNumber: "",
    });
  }, [open, reset]);

  useEffect(() => {
    if (!open || !fx?.rate) return;
    setValue("amount", usdToBs(amount, fx.rate));
  }, [open, fx?.rate, amount, setValue]);

  const copyAccountData = async (account: ReceivingAccount) => {
    if (bsAmount == null) {
      Toast.show({
        type: "error",
        text1: t("Payment.fxUnavailable"),
      });
      return;
    }
    await Clipboard.setStringAsync(formatPagoMovilCopy(account, bsAmount));
    Toast.show({
      type: "success",
      text1: t("Payment.copySuccess"),
    });
  };

  const onSubmit = (data: PaymentFormData) => {
    const payload = {
      san,
      bank: data.sourceBank,
      amount,
      amountBs: Number(data.amount),
      operationReference: data.referenceNumber,
      date: data.paymentDate.toLocaleDateString(),
    };
    if (isJoin) {
      joinSan.mutate(payload, {
        onSuccess: async () => {
          queryClient.invalidateQueries({ queryKey: ["availableSan"] });
          queryClient.invalidateQueries({ queryKey: ["sanDetail"] });
          await queryClient.refetchQueries({ queryKey: ["availableSan"] });
          try {
            const updatedUser = await queryClient.fetchQuery({
              queryKey: ["myAccount"],
              queryFn: fetchAccount,
            });
            setUser(updatedUser);
          } catch (error) {
            console.log(error);
          }
          Toast.show({
            type: "success",
            text1: t("Payment.paymentSuccessTitle"),
            text2: t("Payment.paymentSuccessMessage"),
          });
        },
        onError: (error) => {
          console.log(error);
          Toast.show({
            type: "error",
            text1: t("Payment.paymentErrorTitle"),
            text2: t("Payment.paymentErrorMessage"),
          });
        },
      });
    } else {
      paymentSan.mutate(payload, {
        onSuccess: async () => {
          try {
            const updatedUser = await queryClient.fetchQuery({
              queryKey: ["myAccount"],
              queryFn: fetchAccount,
            });
            setUser(updatedUser);
          } catch (error) {
            console.log(error);
          }
          Toast.show({
            type: "success",
            text1: t("Payment.paymentSuccessTitle"),
            text2: t("Payment.paymentSuccessMessage"),
          });
        },
        onError: (error) => {
          console.log(error);
          Toast.show({
            type: "error",
            text1: t("Payment.paymentErrorTitle"),
            text2: t("Payment.paymentErrorMessage"),
          });
        },
      });
    }

    if (onPaymentRegistered) {
      onPaymentRegistered();
    }
    reset();
    onDismiss();
  };

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <View style={styles.overlayRoot}>
        <Pressable style={styles.backdrop} onPress={onDismiss} />
        <View style={styles.center} pointerEvents="box-none">
          <View style={[styles.card, { maxHeight: height * 0.9 }]}>
            <Text style={styles.dialogTitle}>
              {isJoin ? t("Payment.joinTitle") : t("Payment.title")}
            </Text>
            <ScrollView
              style={[styles.scroll, { maxHeight: height * 0.58 }]}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              <View style={styles.paymentDetails}>
                {receivingAccounts.length === 0 ? (
                  <HelperText type="info">{t("Payment.noReceivingAccounts")}</HelperText>
                ) : (
                  receivingAccounts.map((account) => (
                    <View key={account._id} style={styles.accountBlock}>
                      <View style={styles.detailRow}>
                        <HelperText type="info">{t("Payment.bank")}:</HelperText>
                        <HelperText type="info">
                          {account.bankCode
                            ? `(${account.bankCode}) ${account.bankName}`
                            : account.bankName}
                        </HelperText>
                      </View>
                      {!!account.holderName && (
                        <View style={styles.detailRow}>
                          <HelperText type="info">{t("Payment.holder")}:</HelperText>
                          <HelperText type="info">{account.holderName}</HelperText>
                        </View>
                      )}
                      <View style={styles.detailRow}>
                        <HelperText type="info">{t("Payment.phone")}:</HelperText>
                        <HelperText type="info">{account.phone}</HelperText>
                      </View>
                      <View style={styles.detailRow}>
                        <HelperText type="info">{t("Payment.documentID")}:</HelperText>
                        <HelperText type="info">{account.documentId}</HelperText>
                      </View>
                      {!!account.accountNumber && (
                        <View style={styles.detailRow}>
                          <HelperText type="info">{t("Payment.accountNumber")}:</HelperText>
                          <HelperText type="info">{account.accountNumber}</HelperText>
                        </View>
                      )}
                      <Button
                        mode="outlined"
                        compact
                        textColor="#ff7f50"
                        onPress={() => void copyAccountData(account)}
                        style={styles.copyButton}
                        icon={({ size, color }) => <Copy size={size} color={color} />}
                      >
                        {t("Payment.copyData")}
                      </Button>
                    </View>
                  ))
                )}
                <View style={styles.detailRow}>
                  <HelperText type="info">{t("Payment.amountToPay")}:</HelperText>
                  <Text style={styles.highlightAmount}>{formatUsd(amount)}</Text>
                </View>
                {fxError ? (
                  <HelperText type="error">{t("Payment.fxUnavailable")}</HelperText>
                ) : null}
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
                  <View style={styles.field}>
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
                  <View style={styles.field}>
                    <TextInput
                      label={t("Payment.amount")}
                      value={!value ? "" : String(value)}
                      activeUnderlineColor="#ff7f50"
                      textColor="black"
                      keyboardType="numeric"
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
                  <View style={styles.field}>
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
            </ScrollView>
            <View style={styles.actions}>
              <Button
                textColor="#ff7f50"
                mode="outlined"
                onPress={onDismiss}
                style={formStyles.cancelButton}
              >
                {t("common.cancel")}
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                style={formStyles.confirmButton}
                loading={isPending}
                disabled={!fx?.rate}
              >
                {isJoin ? t("Payment.confirmJoin") : t("Payment.confirmPayment")}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Portal>
  );
};

export default PaymentDialog;

const styles = StyleSheet.create({
  overlayRoot: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
  },
  dialogTitle: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  paymentDetails: {
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  accountBlock: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  copyButton: {
    marginTop: 8,
    borderColor: "#ff7f50",
    alignSelf: "stretch",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  highlightAmount: {
    color: "#ff7f50",
    fontWeight: "bold",
    fontSize: 16,
    paddingRight: 12,
  },
  field: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
});
