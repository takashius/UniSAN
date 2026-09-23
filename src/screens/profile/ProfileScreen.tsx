import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  ChevronRight,
  LogOut,
  Settings,
  CreditCard,
  User,
  FileText,
  ClipboardCheck,
  IdCard,
} from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import UserLevel from "../../components/ui/UserLevel";
import { useTranslation } from "react-i18next";
import { useUser } from "../../context/UserContext";
import { useLogout } from "../../services/auth";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../types/navigation";
import generalStyles from "../../styles/general";
import AvatarView from "../../components/ui/AvatarView";
import { useSanSettings } from "../../services/settings";
import { getLevelType, getMaxLevel } from "../../utils/levels";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import { unregisterCurrentPushToken } from "../../services/notifications";
import AppVersionLabel from "../../components/ui/AppVersionLabel";
import { isAdminRole } from "../../utils/roles";

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout } = useUser();
  const logoutMutate = useLogout();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { data: settings } = useSanSettings();
  const isAdmin = isAdminRole(user?.user.role);
  const level = user?.user.level ? user.user.level : 1;
  const levelType = getLevelType(
    level,
    settings?.levels?.length ? getMaxLevel(settings.levels) : null,
  );

  const handleLogout = () => {
    void unregisterCurrentPushToken().finally(() => {
      logoutMutate.mutate(undefined, {
        onSuccess: () => {
          logout();
        },
        onError: (error) => {
          console.warn("Error:", error);
        },
      });
    });
  };
  return (
    <View style={styles.container}>
      <FullScreenLoader visible={logoutMutate.isPending} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={[generalStyles.card, { marginBottom: 16 }]}
        >
          <View style={styles.profileHeader}>
            <AvatarView
              name={user?.user.name ?? ""}
              lastName={user?.user?.lastName}
              photo={user?.user?.photo}
              mini={true}
            />
            <View style={styles.profileInfo}>
              <View style={styles.profileRow}>
                <Text
                  style={styles.profileName}
                >{`${user?.user.name} ${user?.user.lastName ? user?.user.lastName : ""}`}</Text>
              </View>
              <Text style={styles.profileEmail}>{user?.user.email}</Text>
              <Text style={styles.profileLevel}>
                {t("Profile.level", {
                  level,
                  type: t(`Profile.levelType.${levelType}`),
                })}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={generalStyles.section}>
          <UserLevel />
        </View>

        <View style={generalStyles.section}>
          <Text style={styles.sectionTitle}>{t("Profile.statistics")}</Text>
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
            style={styles.statsGrid}
          >
            <View
              style={[generalStyles.card, { width: "48%", marginBottom: 16 }]}
            >
              <Text style={styles.statLabel}>
                {t("Profile.sansParticipated")}
              </Text>
              <Text style={styles.statValue}>
                {user?.statistics.activeSansCount}
              </Text>
            </View>
            <View
              style={[generalStyles.card, { width: "48%", marginBottom: 16 }]}
            >
              <Text style={styles.statLabel}>
                {t("Profile.paymentsOnTime")}
              </Text>
              <Text style={styles.statValue}>
                {user?.statistics.onTimePayments}/
                {user?.statistics.totalPayments}
              </Text>
            </View>
            <View
              style={[generalStyles.card, { width: "48%", marginBottom: 16 }]}
            >
              <Text style={styles.statLabel}>{t("Profile.sansCompleted")}</Text>
              <Text style={styles.statValue}>
                {user?.statistics.completedSansCount}
              </Text>
            </View>
            <View
              style={[generalStyles.card, { width: "48%", marginBottom: 16 }]}
            >
              <Text style={styles.statLabel}>{t("Profile.totalSaved")}</Text>
              <Text style={styles.statValueOrange}>
                ${user?.statistics.totalSavings}
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={generalStyles.section}>
          <Text style={styles.sectionTitle}>{t("Profile.settings")}</Text>
          <Animated.View
            entering={FadeIn.duration(400).delay(200)}
            style={[generalStyles.card, { padding: 0 }]}
          >
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate("PaymentMethods")}
            >
              <View style={styles.settingsItemRow}>
                <CreditCard size={20} color="#ff7f50" />
                <Text style={styles.settingsItemText}>
                  {t("Profile.paymentMethods")}
                </Text>
              </View>
              <ChevronRight size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <View style={styles.settingsItemRow}>
                <User size={20} color="#ff7f50" />
                <Text style={styles.settingsItemText}>{t("Profile.edit")}</Text>
              </View>
              <ChevronRight size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate("Preference")}
            >
              <View style={styles.settingsItemRow}>
                <Settings size={20} color="#ff7f50" />
                <Text style={styles.settingsItemText}>
                  {t("Profile.preferences")}
                </Text>
              </View>
              <ChevronRight size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate("Terms")}
            >
              <View style={styles.settingsItemRow}>
                <FileText size={20} color="#ff7f50" />
                <Text style={styles.settingsItemText}>
                  {t("Profile.terms")}
                </Text>
              </View>
              <ChevronRight size={20} color="#888" />
            </TouchableOpacity>
            {isAdmin ? (
              <>
                <TouchableOpacity
                  style={styles.settingsItem}
                  onPress={() => navigation.navigate("PendingPayments")}
                >
                  <View style={styles.settingsItemRow}>
                    <ClipboardCheck size={20} color="#ff7f50" />
                    <Text style={styles.settingsItemText}>
                      {t("Profile.pendingPayments")}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#888" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.settingsItem}
                  onPress={() => navigation.navigate("PendingDocuments")}
                >
                  <View style={styles.settingsItemRow}>
                    <IdCard size={20} color="#ff7f50" />
                    <Text style={styles.settingsItemText}>
                      {t("Profile.pendingDocuments")}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#888" />
                </TouchableOpacity>
              </>
            ) : null}
            <TouchableOpacity
              style={[styles.settingsItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#ff4d4d" />
              <Text style={styles.logoutText}>{t("Profile.logout")}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <AppVersionLabel />
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
  },
  profileLevel: {
    fontSize: 14,
    color: "#ff7f50",
    fontWeight: "500",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap", // Asegura el diseño en cuadrícula
    justifyContent: "space-between", // Distribución horizontal
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statValueOrange: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff7f50",
  },
  settingsItem: {
    flexDirection: "row", // Asegura que el icono y texto estén alineados
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  settingsItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsItemText: {
    fontSize: 16,
    marginLeft: 12, // Añade espacio entre el icono y el texto
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: "#ff4d4d",
    marginLeft: 12, // Añade espacio entre el icono y el texto
  },
});
