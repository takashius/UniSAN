import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, Users, ChevronRight } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

interface SANCardProps {
  id: string;
  name: string;
  amount: number;
  period: string;
  participants: number;
  maxParticipants: number;
  nextDate: string;
  hasOpenSpot?: boolean;
}

const SANCard: React.FC<SANCardProps> = ({
  id,
  name,
  amount,
  period,
  participants,
  maxParticipants,
  nextDate,
  hasOpenSpot = false,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={styles.cardContainer}
    >
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.period}>{period}</Text>
          </View>
          <View style={styles.headerAmount}>
            <Text style={styles.amount}>${amount}</Text>
            <Text style={styles.perTurn}>{t("SANCard.perTurn")}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Users size={16} color="#888" style={styles.icon} />
            <Text style={styles.detailText}>
              {t("SANCard.participants", {
                participants,
                maxParticipants,
              })}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Calendar size={16} color="#888" style={styles.icon} />
            <Text style={styles.detailText}>{nextDate}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {hasOpenSpot ? (
            <View style={styles.openSpot}>
              <Text style={styles.openSpotText}>{t("SANCard.openSpot")}</Text>
            </View>
          ) : (
            <View style={{ height: 10 }}></View>
          )}

          <TouchableOpacity style={styles.detailsLink} onPress={() => {
            // @ts-ignore
            navigation.navigate("Explorar", { screen: "SANDetails", params: { id: "123" } })
          }}>
            <Text style={styles.linkText}>{t("SANCard.details")}</Text>
            <ChevronRight size={16} color="#ff7f50" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomBorder} />
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
