import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useUser } from "../../context/UserContext";
import { useSanSettings } from "../../services/settings";
import {
  formatAmount,
  getLevelType,
  getMaxCap,
  getMaxLevel,
  getPointsThreshold,
} from "../../utils/levels";

const UserLevel: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { data: settings } = useSanSettings();

  const level = user?.user.level || 1;
  const points = user?.user.points || 0;
  const maxLevel = settings?.levels?.length
    ? getMaxLevel(settings.levels)
    : null;
  const levelType = getLevelType(level, maxLevel);
  const maxCap = getMaxCap(settings?.levels, level);
  const threshold =
    user?.user.nextLevelPoints ?? getPointsThreshold(settings, level);
  const remaining =
    user?.user.pointsNeeded ??
    (threshold == null ? null : Math.max(0, threshold - points));
  const isMaxLevel =
    user?.user.pointsNeeded === null || (maxLevel != null && level >= maxLevel);
  const progress = isMaxLevel
    ? 100
    : !threshold
      ? 0
      : Math.min(100, Math.max(0, (points / threshold) * 100));

  const progressValue = useSharedValue(0);

  React.useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 1000 });
  }, [progress, progressValue]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>{t("UserLevel.currentLevel")}</Text>
          <View style={styles.levelRow}>
            <Text style={styles.levelTitle}>
              {t("UserLevel.level", { level })}
            </Text>
            <View
              style={[
                styles.badge,
                levelType === "initial"
                  ? styles.badgeInitial
                  : levelType === "max"
                    ? styles.badgeMax
                    : styles.badgeIntermediate,
              ]}
            >
              <Text style={styles.badgeText}>
                {t(`UserLevel.levelType.${levelType}`)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.levelCircle}>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            {t("UserLevel.points", { points })}
          </Text>
          {!isMaxLevel && threshold != null && (
            <Text style={styles.progressLabel}>
              {t("UserLevel.nextLevelPoints", { nextLevelPoints: threshold })}
            </Text>
          )}
        </View>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        <Text style={styles.progressText}>
          {isMaxLevel
            ? t("UserLevel.maxLevelReached")
            : t("UserLevel.pointsToNextLevel", { remaining: remaining ?? 0 })}
        </Text>
      </View>

      {maxCap != null && (
        <View style={styles.benefits}>
          <Text style={styles.benefitsTitle}>
            {t("UserLevel.benefitsTitle")}
          </Text>
          <View style={styles.benefitItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.benefitText}>
              {t("UserLevel.benefitCap", { amount: formatAmount(maxCap) })}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default UserLevel;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeInitial: {
    backgroundColor: "#e0f2fe",
  },
  badgeIntermediate: {
    backgroundColor: "#fff7e0",
  },
  badgeMax: {
    backgroundColor: "#ffe0e0",
  },
  badgeText: {
    fontSize: 12,
    color: "#333",
  },
  levelCircle: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: "#f3e8e2",
    borderWidth: 4,
    borderColor: "#ffd4be",
    alignItems: "center",
    justifyContent: "center",
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff7f50",
  },
  progressSection: {
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#f3e8e2",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ff7f50",
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  benefits: {
    marginTop: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    backgroundColor: "#ff7f50",
    borderRadius: 4,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
});
