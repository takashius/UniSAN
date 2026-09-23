import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePublicTerms } from "../../services/legal";
import { useAcceptTerms } from "../../services/auth";
import { useUser } from "../../context/UserContext";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import Toast from "react-native-toast-message";

type TermsScreenProps = {
  mode?: "read" | "accept";
};

const renderBody = (body: string) => {
  const blocks = String(body || "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split("\n");
    const isList = lines.every((line) => line.trim().startsWith("- "));
    if (isList) {
      return (
        <View key={index} style={styles.list}>
          {lines.map((line, lineIndex) => (
            <Text key={lineIndex} style={styles.paragraph}>
              {"\u2022 "}
              {line.replace(/^\s*-\s+/, "")}
            </Text>
          ))}
        </View>
      );
    }
    return (
      <Text key={index} style={styles.paragraph}>
        {block.replace(/\n/g, " ")}
      </Text>
    );
  });
};

const TermsScreen: React.FC<TermsScreenProps> = ({ mode = "read" }) => {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { setUser } = useUser();
  const { data, isPending, isError, refetch, isFetching } = usePublicTerms(
    i18n.language,
  );
  const acceptTerms = useAcceptTerms();

  const onAccept = () => {
    acceptTerms.mutate(undefined, {
      onSuccess: (account) => {
        setUser(account);
        Toast.show({
          type: "success",
          text1: t("Terms.accepted"),
        });
      },
      onError: () => {
        Toast.show({
          type: "error",
          text1: t("Terms.acceptError"),
        });
      },
    });
  };

  return (
    <View
      style={[
        styles.container,
        mode === "accept" ? { paddingTop: insets.top + 12 } : null,
      ]}
    >
      <FullScreenLoader visible={acceptTerms.isPending} />
      {mode === "accept" ? (
        <Text style={styles.gateTitle}>{t("Terms.title")}</Text>
      ) : null}
      {mode === "accept" ? (
        <Text style={styles.gateSubtitle}>{t("Terms.mustAccept")}</Text>
      ) : null}

      {isPending ? (
        <FullScreenLoader visible />
      ) : isError || !data ? (
        <View style={styles.centered}>
          <Text style={styles.paragraph}>{t("Terms.loadError")}</Text>
          <Button
            textColor="#ff7f50"
            onPress={() => void refetch()}
            loading={isFetching}
          >
            {t("common.retry")}
          </Button>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.meta}>
            {t("Terms.version", { version: data.version })}
            {data.updatedAt
              ? ` · ${new Date(data.updatedAt).toLocaleDateString()}`
              : ""}
          </Text>
          {data.sections.map((section) => (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {renderBody(section.body)}
            </View>
          ))}
        </ScrollView>
      )}

      {mode === "accept" && data ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Button
            mode="contained"
            onPress={onAccept}
            style={styles.acceptButton}
            disabled={acceptTerms.isPending}
          >
            {t("Terms.accept")}
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  gateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    paddingHorizontal: 16,
  },
  gateSubtitle: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  meta: {
    fontSize: 13,
    color: "#888",
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    marginBottom: 8,
  },
  list: {
    marginBottom: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  acceptButton: {
    backgroundColor: "#ff7f50",
  },
});
