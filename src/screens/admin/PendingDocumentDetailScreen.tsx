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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { ProfileStackParamList } from "../../types/navigation";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import {
  useAdminDocument,
  useApproveAdminDocument,
  useRejectAdminDocument,
} from "../../services/adminDocuments";
import { useUser } from "../../context/UserContext";
import { isAdminRole } from "../../utils/roles";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import generalStyles from "../../styles/general";

function personName(
  item?: { name?: string; lastName?: string; email?: string } | null,
) {
  if (!item) return "-";
  const name = `${item.name || ""} ${item.lastName || ""}`.trim();
  return name || item.email || "-";
}

const PendingDocumentDetailScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route =
    useRoute<RouteProp<ProfileStackParamList, "PendingDocumentDetail">>();
  const userId = String(route.params?.userId || "");
  const { user } = useUser();
  const isAdmin = isAdminRole(user?.user.role);
  const { data: document, isLoading } = useAdminDocument(userId);
  const approveMutation = useApproveAdminDocument();
  const rejectMutation = useRejectAdminDocument();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  React.useEffect(() => {
    if (!isAdmin) navigation.goBack();
  }, [isAdmin, navigation]);

  if (!isAdmin) return null;

  const busy = approveMutation.isPending || rejectMutation.isPending;
  const isPending = document?.imageDocumentIdStatus === "pending";

  const onApprove = () => {
    approveMutation.mutate(userId, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: t("PendingDocuments.approveSuccess"),
        });
        navigation.goBack();
      },
      onError: () => {
        Toast.show({
          type: "error",
          text1: t("PendingDocuments.actionError"),
        });
      },
    });
  };

  const onReject = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      Toast.show({
        type: "error",
        text1: t("PendingDocuments.reasonRequired"),
      });
      return;
    }
    rejectMutation.mutate(
      { userId, reason: trimmed },
      {
        onSuccess: () => {
          setShowReject(false);
          setReason("");
          Toast.show({
            type: "success",
            text1: t("PendingDocuments.rejectSuccess"),
          });
          navigation.goBack();
        },
        onError: () => {
          Toast.show({
            type: "error",
            text1: t("PendingDocuments.actionError"),
          });
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <FullScreenLoader visible={isLoading || busy} />
      <ScrollView contentContainerStyle={styles.content}>
        {document ? (
          <View style={generalStyles.card}>
            <Row
              label={t("PendingDocuments.user")}
              value={personName(document)}
            />
            <Row
              label={t("PendingDocuments.documentId")}
              value={document.documentId || "-"}
            />
            <Row
              label={t("PendingDocuments.email")}
              value={document.email || "-"}
            />
            {document.imageDocumentId ? (
              <View style={styles.imageWrap}>
                <Text style={styles.label}>{t("PendingDocuments.photo")}</Text>
                <Image
                  source={{ uri: document.imageDocumentId }}
                  style={styles.photo}
                />
              </View>
            ) : null}
            {!isPending ? (
              <Text style={styles.processed}>
                {t("PendingDocuments.alreadyProcessed")}
              </Text>
            ) : null}
          </View>
        ) : !isLoading ? (
          <Text style={styles.processed}>
            {t("PendingDocuments.loadError")}
          </Text>
        ) : null}

        {document && isPending ? (
          <View style={styles.actions}>
            <Button
              mode="contained"
              style={styles.approve}
              onPress={onApprove}
              disabled={busy}
            >
              {t("PendingDocuments.approve")}
            </Button>
            <Button
              mode="outlined"
              textColor="#ff4d4d"
              onPress={() => setShowReject(true)}
              disabled={busy}
            >
              {t("PendingDocuments.reject")}
            </Button>
          </View>
        ) : null}
      </ScrollView>

      {showReject ? (
        <Portal>
          <View style={styles.overlayRoot}>
            <Pressable
              style={styles.backdrop}
              onPress={() => !busy && setShowReject(false)}
            />
            <View style={styles.dialogCenter} pointerEvents="box-none">
              <View style={styles.dialogCard}>
                <Text style={styles.dialogTitle}>
                  {t("PendingDocuments.rejectTitle")}
                </Text>
                <TextInput
                  style={styles.reasonInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder={t("PendingDocuments.reasonPlaceholder")}
                  multiline
                />
                <View style={styles.dialogActions}>
                  <Button
                    textColor="#888"
                    onPress={() => setShowReject(false)}
                    disabled={busy}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    mode="contained"
                    buttonColor="#ff4d4d"
                    onPress={onReject}
                    disabled={busy}
                  >
                    {t("PendingDocuments.reject")}
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

export default PendingDocumentDetailScreen;

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
  photo: {
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
