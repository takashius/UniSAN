import { View, Text, Animated } from 'react-native'
import React from 'react'
import { Transaction } from '../../types/transactions'
import styles from '../../styles/transactions'
import { useTranslation } from 'react-i18next'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const HistoryTransactionItem: React.FC<{ item: Transaction }> = ({ item }) => {
  const { t } = useTranslation();

  // Animación
  const fadeAnim = useSharedValue(0);
  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: fadeAnim.value * 10 }],
  }));

  return (
    <Animated.View
      style={[styles.historyItem, animatedStyle]}
    >
      <View style={styles.historyItemHeader}>
        <Text style={styles.historyItemTitle}>
          {item.san.name}
        </Text>
        <Text
          style={[
            styles.historyItemAmount,
            styles.amountPaid
          ]}
        >
          + ${item.amount}
        </Text>
      </View>
      <View style={styles.historyItemFooter}>
        <Text style={styles.historyItemDate}>{item.date}</Text>
        <View
          style={[
            styles.statusBadge,
            item.paymentStatus === "early" && styles.statusCompleted,
            item.paymentStatus === "ontime" && styles.statusReceived,
            item.paymentStatus === "late" && styles.statusInfo,
          ]}
        >
          <Text style={styles.statusText}>
            {item.paymentStatus === "early"
              ? t("Payment.early")
              : item.paymentStatus === "ontime"
                ? t("Payment.ontime")
                : t("Payment.late")}
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

export default HistoryTransactionItem