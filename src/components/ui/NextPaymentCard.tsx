import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import nextPaymentStyles from "../../styles/paymentCard";
import { useTranslation } from "react-i18next";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { NextPaymentProps } from "../../types/payment";
import PaymentDialog from "./PaymentDialog";
import generalStyles from "../../styles/general";
import { useBcvRate, useSanSettings } from "../../services/settings";
import { DEFAULT_MEMBERS_PER_SAN } from "../../utils/levels";
import { formatBs, formatUsd, rateForSan, usdToBs } from "../../utils/fx";

const NextPaymentCard: React.FC<NextPaymentProps> = ({
  id,
  name,
  currentTurn,
  amount,
  nextPaymentDate,
  lastPaidTurn,
  fxCurrency,
  paymentAmount,
  baseAmount,
  lateFeeAmount,
  lateFeePercent,
}) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: settings } = useSanSettings();
  const { data: fx } = useBcvRate();
  const membersPerSan = settings?.membersPerSan || DEFAULT_MEMBERS_PER_SAN;
  const installment = paymentAmount ?? amount / membersPerSan;
  const sanRate = rateForSan(fx, fxCurrency);
  const bsAmount = sanRate ? usdToBs(installment, sanRate) : null;
  const paymentTurn = currentTurn && currentTurn > 0 ? currentTurn : 1;
  const paidIndex = lastPaidTurn ?? -1;
  const alreadyPaidThisTurn = paidIndex + 1 >= paymentTurn;

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
      <Animated.View style={[generalStyles.card, animatedStyle]}>
        {name ?
          <View style={nextPaymentStyles.paymentCardHeader}>
            <View>
              <Text style={nextPaymentStyles.cardTitle}>{name}</Text>
              <Text style={nextPaymentStyles.cardSubtitle}>{t("HomeScreen.turn", { current: paymentTurn, total: membersPerSan })}</Text>
            </View>
            <View style={nextPaymentStyles.cardAmountWrap}>
              <Text style={nextPaymentStyles.cardAmount}>{formatUsd(installment)}</Text>
              {bsAmount != null ? (
                <Text style={nextPaymentStyles.cardAmountBs}>{formatBs(bsAmount)}</Text>
              ) : null}
            </View>
          </View>
          :
          <View style={nextPaymentStyles.paymentCardHeader}>
            <Text style={nextPaymentStyles.cardTitle}>
              {t("HomeScreen.turn", { current: paymentTurn, total: membersPerSan })}
            </Text>
            <View style={nextPaymentStyles.cardAmountWrap}>
              <Text style={nextPaymentStyles.cardAmount}>{formatUsd(installment)}</Text>
              {bsAmount != null ? (
                <Text style={nextPaymentStyles.cardAmountBs}>{formatBs(bsAmount)}</Text>
              ) : null}
            </View>
          </View>
        }

        <View style={nextPaymentStyles.paymentDetails}>
          <Text style={nextPaymentStyles.detailsLabel}>{t("HomeScreen.paymentDate")}</Text>
          <Text style={nextPaymentStyles.detailsValue}>{nextPaymentDate ?? t("HomeScreen.noPaymentDate")}</Text>
        </View>

        <TouchableOpacity style={nextPaymentStyles.paymentButton} onPress={() => setDialogOpen(true)}>
          <Text style={nextPaymentStyles.buttonText}>
            {alreadyPaidThisTurn
              ? t("HomeScreen.earlyPaymentButton")
              : t("HomeScreen.PaymentButton")}
          </Text>
        </TouchableOpacity>
      </Animated.View >

      <PaymentDialog
        open={dialogOpen}
        amount={installment}
        san={id}
        fxCurrency={fxCurrency}
        baseAmount={baseAmount}
        lateFeeAmount={lateFeeAmount}
        lateFeePercent={lateFeePercent}
        onDismiss={() => setDialogOpen(false)}
        onPaymentRegistered={() => console.log("Pago registrado!")}
      />
    </>
  );
};

export default NextPaymentCard;