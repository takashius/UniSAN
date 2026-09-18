import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import SANCard from "../components/ui/SANCard";
import UserLevel from "../components/ui/UserLevel";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserContext";
import SANPlaceholder from "../components/SANPlaceholder";
import NextPaymentCard from "../components/ui/NextPaymentCard";
import generalStyles from "../styles/general";
import { fetchAccount } from "../services/auth";
import {
  formatOtaTimestamp,
  getAppVersion,
  getNativeBuild,
  getOtaUpdate,
} from "../utils/appVersion";

const HomeScreen = () => {
  const { t } = useTranslation();
  const { user, setUser } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const refreshAccount = useCallback(async () => {
    const account = await fetchAccount();
    setUser(account);
  }, [setUser]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const load = async () => {
        try {
          const account = await fetchAccount();
          if (!cancelled) setUser(account);
        } catch (error) {
          console.log(error);
        }
      };
      void load();
      return () => {
        cancelled = true;
      };
    }, [setUser])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAccount();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  const appVersion = getAppVersion();
  const nativeBuild = getNativeBuild();
  const ota = getOtaUpdate();
  const versionLabel = nativeBuild
    ? t("HomeScreen.appVersionBuild", { version: appVersion, build: nativeBuild })
    : t("HomeScreen.appVersion", { version: appVersion });
  const otaLabel = ota
    ? ota.createdAt
      ? t("HomeScreen.otaBuildWithDate", {
          id: ota.id,
          date: formatOtaTimestamp(ota.createdAt),
        })
      : t("HomeScreen.otaBuild", { id: ota.id })
    : t("HomeScreen.embeddedBuild");

  const GetWelcomeMessage = () => {
    const sansCount = user?.statistics.activeSansCount ? user?.statistics.activeSansCount : 0;
    const daysUntilNextPayment = user?.statistics.daysUntilNextPayment ? user?.statistics.daysUntilNextPayment : 0;;

    if (sansCount === 0) {
      return <Text style={styles.welcomeText}>{t("HomeScreen.noActiveSansMessage")}</Text>;
    }

    const sansKey = sansCount === 1 ? "singularSan" : "pluralSan";

    let paymentMessage = "";
    if (daysUntilNextPayment > 0) {
      paymentMessage = t(`HomeScreen.paymentUpcoming`, { days: daysUntilNextPayment });
    } else if (daysUntilNextPayment === 0) {
      paymentMessage = t(`HomeScreen.paymentToday`);
    } else if (daysUntilNextPayment < 0) {
      paymentMessage = t(`HomeScreen.paymentOverdue`, { days: Math.abs(daysUntilNextPayment) });
    }

    return <Text style={styles.welcomeText}>{t("HomeScreen.welcomeMessage", {
      sansCount,
      sansText: t(`HomeScreen.${sansKey}`),
      days: Math.abs(daysUntilNextPayment || 0),
      paymentMessage,
    })}</Text>;
  }

  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={generalStyles.mainContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
            colors={["#ff7f50"]}
            tintColor="#ff7f50"
          />
        }
      >
        <Animated.View style={[generalStyles.card, { marginVertical: 16 }]} entering={FadeInDown.duration(400)}>
          <Text style={styles.welcomeTitle}>
            {t("HomeScreen.welcome")}, <Text style={styles.highlight}>{`${user?.user.name}`}</Text>
          </Text>
          <GetWelcomeMessage />
        </Animated.View>

        <UserLevel />

        <View style={styles.section}>
          {!user?.sans?.length ? (
            <SANPlaceholder />
          ) : (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t("HomeScreen.activeSANs")}</Text>
            </View>
          )}
          {user?.sans.map((san, index) => (
            <Animated.View
              key={san.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
              style={{ marginBottom: 16 }}
            >
              <SANCard
                key={san.id}
                {...san}
                hasOpenSpot={Boolean(san.isOpen ?? san.hasOpenSpot)}
                external
              />
            </Animated.View>
          ))}
        </View>

        {user?.nextPayments && user?.nextPayments.length > 0 &&
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t("HomeScreen.upcomingPayments")}</Text>
            </View>
            {user?.nextPayments.map((payment, index) => (
              <NextPaymentCard
                key={payment.id}
                id={payment.id}
                name={payment.sanName}
                currentTurn={payment.currentTurn}
                amount={payment.sanAmount}
                nextPaymentDate={payment.nextPaymentDate}
                lastPaidTurn={payment.lastPaidTurn!}
                fxCurrency={payment.fxCurrency}
              />
            ))}
          </View>
        }

        <Text style={styles.versionText}>{versionLabel}</Text>
        <Text style={styles.versionSubText}>{otaLabel}</Text>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  highlight: {
    color: "#ff7f50",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: "#ff7f50",
    fontSize: 14,
    marginRight: 4,
  },
  versionText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
  },
  versionSubText: {
    marginTop: 2,
    marginBottom: 8,
    textAlign: "center",
    fontSize: 11,
    color: "#9ca3af",
  },

});
