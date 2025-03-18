import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  ArrowLeft,
  Calendar,
  Users,
  Info,
  MessageCircle,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const SANDetails: React.FC = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const sanDetails = {
    id: "1",
    name: "SAN Básico",
    amount: 100,
    period: "Semanal",
    participants: 8,
    maxParticipants: 10,
    nextDate: "15 mayo",
    startDate: "1 marzo, 2023",
    endDate: "1 julio, 2023",
    description:
      "Este SAN permite a los participantes ahorrar y recibir fondos de manera rotativa.",
    members: [
      { id: "1", name: "María González", avatar: "🧑‍🦱", turn: 1, status: "completed" },
      { id: "2", name: "Juan Pérez", avatar: "👨", turn: 2, status: "completed" },
      { id: "3", name: "Ana López", avatar: "👩", turn: 3, status: "current" },
      { id: "4", name: "Luis Torres", avatar: "🧔", turn: 4, status: "pending" },
      { id: "5", name: "Carla Ruiz", avatar: "👩‍🦰", turn: 5, status: "pending" },
      { id: "6", name: "Roberto Silva", avatar: "👨‍🦲", turn: 6, status: "pending" },
      { id: "9", name: "", avatar: "❓", turn: 9, status: "available" },
      { id: "10", name: "", avatar: "❓", turn: 10, status: "available" },
    ],
    myTurn: 3,
    totalTurns: 10,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Explorer")}>
          <ArrowLeft size={24} color="#888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sanDetails.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.sanTitle}>{sanDetails.name}</Text>
                <Text style={styles.periodText}>{sanDetails.period}</Text>
              </View>
              <Text style={styles.amountText}>${sanDetails.amount}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Calendar size={16} color="#888" />
                <Text style={styles.infoText}>{sanDetails.nextDate}</Text>
              </View>
              <View style={styles.infoItem}>
                <Users size={16} color="#888" />
                <Text style={styles.infoText}>
                  {t("SANDetails.participants", {
                    current: sanDetails.participants,
                    max: sanDetails.maxParticipants,
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.primaryButton}>
                <MessageCircle size={16} color="#fff" />
                <Text style={styles.buttonText}>{t("SANDetails.groupChat")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Info size={16} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>{t("SANDetails.descriptionTitle")}</Text>
          <Text style={styles.descriptionText}>{sanDetails.description}</Text>

          <View style={styles.dateRow}>
            <View>
              <Text style={styles.infoText}>{t("SANDetails.startDate")}</Text>
              <Text style={styles.dateText}>{sanDetails.startDate}</Text>
            </View>
            <View>
              <Text style={styles.infoText}>{t("SANDetails.endDate")}</Text>
              <Text style={styles.dateText}>{sanDetails.endDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("SANDetails.progressTitle")}</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{t("SANDetails.yourTurn")}</Text>
              <Text style={styles.turnBadge}>
                {t("SANDetails.turnBadge", {
                  current: sanDetails.myTurn,
                  total: sanDetails.totalTurns,
                })}
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={{
                  ...styles.progressBar,
                  width: `${(sanDetails.myTurn / sanDetails.totalTurns) * 100}%`,
                }}
              />
            </View>
            <Text style={styles.progressText}>
              {sanDetails.myTurn < 3
                ? t("SANDetails.alreadyReceived")
                : sanDetails.myTurn === 3
                  ? t("SANDetails.currentTurn")
                  : t("SANDetails.turnsRemaining", {
                    remaining: sanDetails.myTurn - 3,
                  })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("SANDetails.membersTitle")}</Text>
          <View style={styles.membersCard}>
            {sanDetails.members.map((member, index) => (
              <View
                key={member.id}
                style={[
                  styles.memberItem,
                  member.status === "current" && styles.currentMember,
                ]}
              >
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{member.avatar}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>
                    {member.name || t("SANDetails.availableTurn")}
                  </Text>
                  <Text style={styles.memberTurn}>{t("SANDetails.turn", { turn: member.turn })}</Text>
                </View>
                <View>
                  {member.status === "completed" && (
                    <Text style={[styles.statusBadge, styles.completedBadge]}>
                      {t("SANDetails.completed")}
                    </Text>
                  )}
                  {member.status === "current" && (
                    <Text style={[styles.statusBadge, styles.currentBadge]}>
                      {t("SANDetails.current")}
                    </Text>
                  )}
                  {member.status === "available" && (
                    <TouchableOpacity style={styles.joinButton}>
                      <Text style={styles.joinText}>{t("SANDetails.join")}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SANDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sanTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  periodText: {
    fontSize: 14,
    color: "#888",
  },
  amountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff7f50",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff7f50",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    marginLeft: 8,
  },
  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  turnBadge: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ff7f50",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ff7f50",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
  },
  membersCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  currentMember: {
    backgroundColor: "#fef3c7",
  },
  avatarContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#ffe4cf",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  memberTurn: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: "center",
  },
  completedBadge: {
    backgroundColor: "#d1fae5",
    color: "#10b981",
  },
  currentBadge: {
    backgroundColor: "#fee2e2",
    color: "#ff7f50",
  },
  joinButton: {
    backgroundColor: "#ff7f50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
});