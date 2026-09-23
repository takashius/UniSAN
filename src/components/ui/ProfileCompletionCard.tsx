import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { TabParamList } from "../../types/navigation";
import { useTranslation } from "react-i18next";
import { useUser } from "../../context/UserContext";
import { openEditProfile } from "../../utils/profileCompletion";
import generalStyles from "../../styles/general";

const ProfileCompletionCard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const { user } = useUser();
  const completion = user?.profileCompletion;
  const percent = completion?.percent ?? 0;
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(Math.min(100, Math.max(0, percent)), {
      duration: 700,
    });
  }, [percent, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  if (!completion || completion.complete) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={[generalStyles.card, styles.card]}
    >
      <Text style={styles.title}>{t("ProfileCompletion.title")}</Text>
      <Text style={styles.subtitle}>{t("ProfileCompletion.subtitle")}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
      <Text style={styles.percent}>
        {t("ProfileCompletion.percent", { percent })}
      </Text>
      <TouchableOpacity onPress={() => openEditProfile(navigation)}>
        <Text style={styles.link}>{t("ProfileCompletion.completeNow")}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ProfileCompletionCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#e5e5e5",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#ff7f50",
    borderRadius: 999,
  },
  percent: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#ff7f50",
  },
  link: {
    marginTop: 10,
    color: "#ff7f50",
    fontWeight: "600",
  },
});
