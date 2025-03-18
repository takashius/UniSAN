import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

interface UserLevelProps {
  level: number;
  points: number;
  nextLevelPoints: number;
}

const UserLevel: React.FC<UserLevelProps> = ({ level, points, nextLevelPoints }) => {
  const { t } = useTranslation();
  const progress = (points / nextLevelPoints) * 100;
  const progressValue = useSharedValue(0);

  React.useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  const badgeStyles: { [key: number]: any } = {
    1: styles.badgeLevel1,
    2: styles.badgeLevel2,
    3: styles.badgeLevel3,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>{t("UserLevel.currentLevel")}</Text>
          <View style={styles.levelRow}>
            <Text style={styles.levelTitle}>{t("UserLevel.level", { level })}</Text>
            <View style={[styles.badge, badgeStyles[level]]}>
              <Text style={styles.badgeText}>
                {level === 1 ? t("UserLevel.level1") : level === 2 ? t("UserLevel.level2") : t("UserLevel.level3")}
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
          <Text style={styles.progressLabel}>{t("UserLevel.points", { points })}</Text>
          <Text style={styles.progressLabel}>{t("UserLevel.nextLevelPoints", { nextLevelPoints })}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        <Text style={styles.progressText}>
          {t("UserLevel.pointsToNextLevel", {
            remaining: nextLevelPoints - points,
          })}
        </Text>
      </View>

      <View style={styles.benefits}>
        <Text style={styles.benefitsTitle}>{t("UserLevel.benefitsTitle")}</Text>
        <View style={styles.benefitItem}>
          <View style={styles.bulletPoint} />
          <Text style={styles.benefitText}>
            {t("UserLevel.benefit1", {
              amount: level === 1 ? "100" : level === 2 ? "300" : "1000",
            })}
          </Text>
        </View>
        {level >= 2 && (
          <View style={styles.benefitItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.benefitText}>
              {t("UserLevel.benefit2", {
                count: level === 2 ? 2 : 3,
              })}
            </Text>
          </View>
        )}
        {level >= 3 && (
          <View style={styles.benefitItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.benefitText}>{t("UserLevel.benefit3")}</Text>
          </View>
        )}
      </View>
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
  badgeLevel1: {
    backgroundColor: "#e0f2fe", // Azul claro
  },
  badgeLevel2: {
    backgroundColor: "#fff7e0", // Amarillo claro
  },
  badgeLevel3: {
    backgroundColor: "#ffe0e0", // Rojo claro
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
  },
});
