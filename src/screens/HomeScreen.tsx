import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import SANCard from "../components/ui/SANCard";
import UserLevel from "../components/ui/UserLevel";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserContext";
import SANPlaceholder from "../components/SANPlaceholder";

const HomeScreen = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  console.log('USER', JSON.stringify(user, null, 2));

  const GetWelcomeMessage = () => {
    const sansCount = user?.statistics.activeSansCount ? user?.statistics.activeSansCount : 0;
    const daysUntilNextPayment = user?.statistics.daysUntilNextPayment ? user?.statistics.daysUntilNextPayment : 0;;

    // Determinar si no hay SANs activos
    if (sansCount === 0) {
      return <Text style={styles.welcomeText}>{t("noActiveSansMessage")}</Text>; // Mensaje específico cuando no hay SANs activos
    }

    // Determinar el texto del número de SANs (singular/plural)
    const sansKey = sansCount === 1 ? "singularSan" : "pluralSan";

    // Determinar el mensaje del próximo pago
    let paymentMessage = "";
    if (daysUntilNextPayment > 0) {
      paymentMessage = t(`HomeScreen.paymentUpcoming`, { days: daysUntilNextPayment });
    } else if (daysUntilNextPayment === 0) {
      paymentMessage = t(`HomeScreen.paymentToday`);
    } else if (daysUntilNextPayment < 0) {
      paymentMessage = t(`HomeScreen.paymentOverdue`, { days: Math.abs(daysUntilNextPayment) });
    }

    // Obtener el texto traducido utilizando i18n
    return <Text style={styles.welcomeText}>{t("HomeScreen.welcomeMessage", {
      sansCount,
      sansText: t(`HomeScreen.${sansKey}`), // Texto dinámico para singular/plural
      days: Math.abs(daysUntilNextPayment || 0), // Valor absoluto para días vencidos
      paymentMessage, // Mensaje dinámico según los días
    })}</Text>;
  }

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.mainContent}>
        <Animated.View style={styles.glassCard} entering={FadeInDown.duration(400)}>
          <Text style={styles.welcomeTitle}>
            {t("HomeScreen.welcome")}, <Text style={styles.highlight}>{`${user?.user.name}`}</Text>
          </Text>
          <GetWelcomeMessage />
        </Animated.View>

        <UserLevel level={user?.user.level ? user?.user.level : 1} points={user?.user.points ? user?.user.points : 0} nextLevelPoints={100} />

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
              <Animated.View key={payment.id} style={styles.paymentCard} entering={FadeInDown.delay(200).duration(500)}>
                <View style={styles.paymentCardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{payment.sanName}</Text>
                    <Text style={styles.cardSubtitle}>{t("HomeScreen.turn", { current: 3, total: 10 })}</Text>
                  </View>
                  <Text style={styles.cardAmount}>${payment.sanAmount}</Text>
                </View>
                <View style={styles.paymentDetails}>
                  <Text style={styles.detailsLabel}>{t("HomeScreen.paymentDate")}</Text>
                  <Text style={styles.detailsValue}>{payment.nextPaymentDate}</Text>
                </View>
                <TouchableOpacity style={styles.paymentButton}>
                  <Text style={styles.buttonText}>{t("HomeScreen.earlyPaymentButton")}</Text>
                </TouchableOpacity>
              </Animated.View>
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
    backgroundColor: "#f3f4f6", // Fondo claro similar al bg-san-light-gray
  },
  mainContent: {
    padding: 16,
  },
  glassCard: {
    backgroundColor: "#ffffff", // Color semitransparente
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    color: "#ff7f50", // Color similar a text-san-orange
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
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#888",
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff7f50",
  },
  paymentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailsLabel: {
    fontSize: 12,
    color: "#888",
  },
  detailsValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  paymentButton: {
    backgroundColor: "#ff7f50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
