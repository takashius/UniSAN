import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { Button, Portal } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import {
  useAdminPayment,
  useRejectAdminPayment,
  useValidateAdminPayment,
} from "../../services/adminPayments";
import { useUser } from "../../context/UserContext";
import { isAdminRole } from "../../utils/roles";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import generalStyles from "../../styles/general";

function personName(person?: { name?: string; lastName?: string; email?: string } | null) {
  if (!person) return "-";
  const name = `${person.name || ""} ${person.lastName || ""}`.trim();
  return name || person.email || "-";
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

const PendingPaymentDetailScreen = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const id = String(route.params?.id || "");
  const { user } = useUser();
  const isAdmin = isAdminRole(user?.user.role);
  const { data: payment, isLoading } = useAdminPayment(id);
  const validateMutation = useValidateAdminPayment();
  const rejectMutation = useRejectAdminPayment();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  React.useEffect(() => {
    if (!isAdmin) navigation.goBack();
  }, [isAdmin, navigation]);

  if (!isAdmin) return null;

  const busy = validateMutation.isPending || rejectMutation.isPending;
  const isPending = payment?.status === "pending";

  const onApprove = () => {
    validateMutation.mutate(id, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: t("PendingPayments.approveSuccess"),
        });
        navigation.goBack();
      },
      onError: () => {
        Toast.show({
          type: "error",
          text1: t("PendingPayments.actionError"),
        });
      },
    });
  };

  const onReject = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      Toast.show({
        type: "error",
        text1: t("PendingPayments.reasonRequired"),
      });
      return;
    }
    rejectMutation.mutate(
      { id, reason: trimmed },
      {
        onSuccess: () => {
          setShowReject(false);
          setReason("");
          Toast.show({
            type: "success",
            text1: t("PendingPayments.rejectSuccess"),
          });
          navigation.goBack();
        },
        onError: () => {
          Toast.show({
            type: "error",
            text1: t("PendingPayments.actionError"),
          });
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <FullScreenLoader visible={isLoading || busy} />
      <ScrollView contentContainerStyle={styles.content}>
        {payment ? (
          <View style={generalStyles.card}>
            <Row label={t("PendingPayments.payer")} value={personName(payment.user)} />
            <Row label={t("PendingPayments.san")} value={payment.san?.name || "-"} />
            <Row
              label={t("PendingPayments.bank")}
              value={
                payment.bank
                  ? `${payment.bank.name || "-"}${payment.bank.code ? ` (${payment.bank.code})` : ""}`
                  : "-"
              }
            />
            <Row label={t("PendingPayments.amount")} value={`$${payment.amount}`} />
            {payment.lateFeeAmount ? (
              <>
                <Row
                  label={t("PendingPayments.baseAmount")}
                  value={`$${payment.baseAmount ?? payment.amount}`}
                />
                <Row
                  label={t("PendingPayments.lateFee")}
                  value={`$${payment.lateFeeAmount}${
                    payment.lateFeePercent ? ` (${payment.lateFeePercent}%)` : ""
                  }`}
                />
              </>
            ) : null}
            <Row label={t("PendingPayments.reference")} value={String(payment.operationReference)} />
            <Row label={t("PendingPayments.turn")} value={String(payment.paymentDateIndex + 1)} />
            <Row
              label={t("PendingPayments.timing")}
              value={t(`Payment.${payment.paymentStatus}`, { defaultValue: payment.paymentStatus })}
            />
            <Row label={t("PendingPayments.date")} value={formatDate(payment.date)} />
            {payment.operationImage ? (
              <View style={styles.imageWrap}>
                <Text style={styles.label}>{t("PendingPayments.receipt")}</Text>
                <Image source={{ uri: payment.operationImage }} style={styles.receipt} />
              </View>
            ) : null}
            {!isPending ? (
              <Text style={styles.processed}>{t("PendingPayments.alreadyProcessed")}</Text>
            ) : null}
          </View>
        ) : !isLoading ? (
          <Text style={styles.processed}>{t("PendingPayments.loadError")}</Text>
        ) : null}

        {payment && isPending ? (
          <View style={styles.actions}>
            <Button mode="contained" style={styles.approve} onPress={onApprove} disabled={busy}>
              {t("PendingPayments.approve")}
            </Button>
            <Button mode="outlined" textColor="#ff4d4d" onPress={() => setShowReject(true)} disabled={busy}>
              {t("PendingPayments.reject")}
            </Button>
          </View>
        ) : null}
      </ScrollView>

      {showReject ? (
        <Portal>
          <View style={styles.overlayRoot}>
            <Pressable style={styles.backdrop} onPress={() => !busy && setShowReject(false)} />
            <View style={styles.dialogCenter} pointerEvents="box-none">
              <View style={styles.dialogCard}>
                <Text style={styles.dialogTitle}>{t("PendingPayments.rejectTitle")}</Text>
                <TextInput
                  style={styles.reasonInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder={t("PendingPayments.reasonPlaceholder")}
                  multiline
                />
                <View style={styles.dialogActions}>
                  <Button textColor="#888" onPress={() => setShowReject(false)} disabled={busy}>
                    {t("common.cancel")}
                  </Button>
                  <Button mode="contained" buttonColor="#ff4d4d" onPress={onReject} disabled={busy}>
                    {t("PendingPayments.reject")}
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Portal>
      ) : null}
    </View>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default PendingPaymentDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  imageWrap: {
    marginTop: 8,
  },
  receipt: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#eee",
  },
  processed: {
    marginTop: 8,
    fontSize: 14,
    color: "#888",
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  approve: {
    backgroundColor: "#ff7f50",
  },
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
  dialogCenter: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  dialogCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  reasonInput: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
