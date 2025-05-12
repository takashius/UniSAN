import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import nextPaymentStyles from "../../styles/paymentCard";
import { useTranslation } from "react-i18next";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { NextPaymentProps } from "../../types/payment";
import PaymentDialog from "./PaymentDialog";

const NextPaymentCard: React.FC<NextPaymentProps> = ({ id, name, currentTurn, amount, nextPaymentDate, lastPaidTurn }) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

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
    <>
      <Animated.View style={[nextPaymentStyles.paymentCard, animatedStyle]}>
        {name ?
          <View style={nextPaymentStyles.paymentCardHeader}>
            <View>
              <Text style={nextPaymentStyles.cardTitle}>{name}</Text>
              <Text style={nextPaymentStyles.cardSubtitle}>{t("HomeScreen.turn", { current: 3, total: 10 })}</Text>
            </View>
            <Text style={nextPaymentStyles.cardAmount}>${amount}</Text>
          </View>
          :
          <View style={nextPaymentStyles.paymentCardHeader}>
            <Text style={nextPaymentStyles.cardTitle}>
              {t("HomeScreen.turn", { current: (currentTurn ?? 0) + 1, total: 10 })}
            </Text>
            <Text style={nextPaymentStyles.cardAmount}>${amount}</Text>
          </View>
        }

        <View style={nextPaymentStyles.paymentDetails}>
          <Text style={nextPaymentStyles.detailsLabel}>{t("HomeScreen.paymentDate")}</Text>
          <Text style={nextPaymentStyles.detailsValue}>{nextPaymentDate ?? t("HomeScreen.noPaymentDate")}</Text>
        </View>

        <TouchableOpacity style={nextPaymentStyles.paymentButton} onPress={() => setDialogOpen(true)}>
          <Text style={nextPaymentStyles.buttonText}>
            {(lastPaidTurn ?? 0) + 1 > (currentTurn ?? 0)
              ? t("HomeScreen.earlyPaymentButton")
              : t("HomeScreen.PaymentButton")}
          </Text>
        </TouchableOpacity>
      </Animated.View >

      <PaymentDialog
        open={dialogOpen}
        amount={amount / 10}
        san={id}
        onDismiss={() => setDialogOpen(false)}
        onPaymentRegistered={() => console.log("Pago registrado!")}
      />
    </>
  );
};

export default NextPaymentCard;