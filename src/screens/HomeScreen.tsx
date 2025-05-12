import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import SANCard from "../components/ui/SANCard";
import UserLevel from "../components/ui/UserLevel";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserContext";
import SANPlaceholder from "../components/SANPlaceholder";
import NextPaymentCard from "../components/ui/NextPaymentCard";
import generalStyles from "../styles/general";

const HomeScreen = () => {
  const { t } = useTranslation();
  const { user } = useUser();

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

      <ScrollView contentContainerStyle={generalStyles.mainContent}>
        <Animated.View style={[generalStyles.card, { marginBottom: 16 }]} entering={FadeInDown.duration(400)}>
          <Text style={styles.welcomeTitle}>
            {t("HomeScreen.welcome")}, <Text style={styles.highlight}>{`${user?.user.name}`}</Text>
          </Text>
          <GetWelcomeMessage />
        </Animated.View>

        <UserLevel
          level={user?.user.level ? user?.user.level : 1}
          points={user?.user.points ? user?.user.points : 0}
          nextLevelPoints={user?.user.pointsNeeded ? user?.user.pointsNeeded : 0} />

        <View style={styles.section}>
          {user?.sans.length === 0 ? (
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
              <SANCard key={san.id} {...san} />
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
              />
            ))}
          </View>
        }
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

});
