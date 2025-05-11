import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, Users, ChevronRight, PlusCircle } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import PaymentDialog from "./PaymentDialog";

interface SANCardProps {
  id: string;
  sanName: string;
  amount: number;
  frequency: string;
  position: number;
  startDate: string;
  hasOpenSpot?: boolean;
  external?: boolean;
}

const SANCard: React.FC<SANCardProps> = ({
  id,
  sanName,
  amount,
  frequency,
  position,
  startDate,
  hasOpenSpot = false,
  external = true,
}) => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={styles.cardContainer}
    >
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{sanName}</Text>
            <Text style={styles.period}>{frequency}</Text>
          </View>
          <View style={styles.headerAmount}>
            <Text style={styles.amount}>${amount}</Text>
            <Text style={styles.perTurn}>{t("SANCard.perTurn")}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Users size={16} color="#888" style={styles.icon} />
            <Text style={styles.detailText}>
              {position}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Calendar size={16} color="#888" style={styles.icon} />
            <Text style={styles.detailText}>{startDate}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          {hasOpenSpot && !external ? (
            <View style={styles.openSpot}>
              <Text style={styles.openSpotText}>{t("SANCard.openSpot")}</Text>
            </View>
          ) : (
            <View style={{ height: 10 }}></View>
          )}

          {external ?
            <TouchableOpacity style={styles.detailsLink} onPress={() => navigation.navigate("Explorer", { screen: "SANDetails", params: { id: "123" } })}>
              <Text style={styles.linkText}>{t("SANCard.details")}</Text>
              <ChevronRight size={16} color="#ff7f50" />
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.detailsLink} onPress={() => setDialogOpen(true)}>
              <Text style={styles.linkText}>{t("SANCard.join")}</Text>
              <PlusCircle size={16} color="#ff7f50" />
            </TouchableOpacity>
          }

        </View>
      </View>
      <View style={styles.bottomBorder} />
      <PaymentDialog
        open={dialogOpen}
        amount={amount / 10}
        san={id}
        onDismiss={() => setDialogOpen(false)}
        onPaymentRegistered={() => console.log("Pago registrado!")}
      />

    </Animated.View>
  );
};

export default SANCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 4,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  period: {
    fontSize: 14,
    color: "#888",
  },
  headerAmount: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff7f50",
  },
  perTurn: {
    fontSize: 12,
    color: "#888",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  openSpot: {
    backgroundColor: "#d1fae5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  openSpotText: {
    color: "#059669",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: "#ff7f50",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  bottomBorder: {
    height: 4,
    backgroundColor: "#ff7f50",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});
