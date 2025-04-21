import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import SANCard from "../components/ui/SANCard";
import { useTranslation } from "react-i18next";
import { useAvailableSan } from "../services/san";

const Explorer: React.FC = () => {
  const { t } = useTranslation();
  const { data: availableSANs, isLoading } = useAvailableSan();

  return (
    <View style={styles.container}>

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ff4d4d" />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.mainContent}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Explorer.availableSANs")}</Text>
          {availableSANs && availableSANs.length > 0 ? (
            <View style={styles.cardList}>
              {availableSANs.map((san, index) => (
                <Animated.View
                  key={san._id}
                  entering={FadeInDown.delay(index * 100).duration(400)}
                >
                  <SANCard
                    id={san._id}
                    sanName={san.name}
                    amount={san.amount}
                    frequency={san.frequency}
                    position={0}
                    startDate={san.createdAt}
                    hasOpenSpot={san.members.length < 12}
                    external={false}
                  />
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {t("Explorer.noResults")}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Explorer.recommendedSANs")}</Text>
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.recommendedCard}
          >
            <View style={styles.recommendedCardHeader}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>💰</Text>
              </View>
              <View>
                <Text style={styles.recommendedTitle}>{t("Explorer.recommendedTitle")}</Text>
                <Text style={styles.recommendedSubtitle}>
                  $500 · {t("Explorer.monthly")} · 12 {t("Explorer.participants")}
                </Text>
              </View>
            </View>
            <Text style={styles.recommendedDescription}>
              {t("Explorer.recommendedDescription")}
            </Text>
            <TouchableOpacity style={styles.disabledButton} disabled>
              <Text style={styles.disabledButtonText}>
                {t("Explorer.upgradeToJoin")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Explorer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  cardList: {
    gap: 16,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 24,
  },
  noResultsText: {
    fontSize: 14,
    color: "#666",
  },
  recommendedCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emojiContainer: {
    backgroundColor: "#ffdcb2",
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  recommendedSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  recommendedDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: "#e5e5e5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButtonText: {
    color: "#999",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  }
});
