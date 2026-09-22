import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import SANCard from "../components/ui/SANCard";
import { useTranslation } from "react-i18next";
import { useAvailableSan } from "../services/san";
import { useSanSettings } from "../services/settings";
import { useUser } from "../context/UserContext";
import generalStyles from "../styles/general";
import { DEFAULT_MEMBERS_PER_SAN } from "../utils/levels";
import FullScreenLoader from "../components/ui/FullScreenLoader";

const Explorer: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { data: availableSANs, isLoading, refetch } = useAvailableSan();
  const { data: settings } = useSanSettings();
  const membersPerSan = settings?.membersPerSan || DEFAULT_MEMBERS_PER_SAN;
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const isMemberOf = (sanId: string) =>
    (user?.sans ?? []).some((item) => String(item.id) === String(sanId));

  return (
    <View style={styles.container}>

      <FullScreenLoader visible={isLoading && !refreshing} />
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Explorer.availableSANs")}</Text>
          {availableSANs && availableSANs.length > 0 ? (
            <View style={styles.cardList}>
              {availableSANs.map((san, index) => (
                <Animated.View
                  key={san._id}
                  entering={FadeInDown.delay(index * 100).duration(400)}
                >
                  <SANCard
                    id={san._id}
                    sanName={san.name}
                    amount={san.amount}
                    frequency={san.frequency}
                    position={0}
                    startDate={san.createdAt}
                    usersCount={san.members?.length ?? 0}
                    fxCurrency={san.fxCurrency}
                    joinMode={san.joinMode}
                    hasOpenSpot={
                      isMemberOf(san._id)
                        ? Boolean(san.isOpen)
                        : (san.members?.length ?? 0) < membersPerSan
                    }
                    external={isMemberOf(san._id)}
                  />
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {t("Explorer.noResults")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Explorer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  cardList: {
    gap: 16,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 24,
  },
  noResultsText: {
    fontSize: 14,
    color: "#666",
  },
});
