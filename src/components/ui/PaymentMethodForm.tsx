import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { Button, TextInput, HelperText, Portal } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
} from "../../services/paymentMethod";
import { PaymentMethod, PaymentMethodCreate } from "../../types/paymentMethod";
import Toast from "react-native-toast-message";
import BankSelectField from "./BankSelectField";
import SelectField from "./SelectField";
import formStyles from "../../styles/FormStyles";

interface PaymentMethodFormProps {
  visible: boolean;
  onDismiss: () => void;
  method?: PaymentMethod;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  visible,
  onDismiss,
  method,
}) => {
  const { control, handleSubmit, watch, reset, setValue } =
    useForm<PaymentMethodCreate>({
      defaultValues: {
        title: "",
        bank: "",
        method: "transferencia",
        idNumber: "",
        accountType: "ahorro",
        accountNumber: "",
        phoneNumber: "",
      },
    });

  const { t } = useTranslation();
  const createPaymentMethod = useCreatePaymentMethod();
  const updatePaymentMethod = useUpdatePaymentMethod();

  const paymentType = watch("method");

  useEffect(() => {
    if (method) {
      setValue("title", method.title);
      setValue("bank", method.bank._id);
      setValue("method", method.method);
      setValue("idNumber", method.idNumber);
      setValue("accountType", method.accountType || "ahorro");
      setValue("accountNumber", method.accountNumber || "");
      setValue("phoneNumber", method.phoneNumber || "");
    } else {
      reset();
    }
  }, [method, setValue, reset]);

  const onSubmit = (data: PaymentMethodCreate) => {
    if (method) {
      updatePaymentMethod.mutate(
        { id: method._id, data },
        {
          onSuccess: () => {
            Toast.show({
              type: "success",
              text1: t("alerts.updatedTitle"),
              text2: t("alerts.updatedMessage"),
            });
            onDismiss();
          },
          onError: () => {
            Toast.show({
              type: "error",
              text1: t("alerts.errorTitle"),
              text2: t("alerts.errorMessage"),
            });
          },
        },
      );
    } else {
      createPaymentMethod.mutate(data, {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: t("alerts.createdTitle"),
            text2: t("alerts.createdMessage"),
          });
          onDismiss();
        },
        onError: () => {
          Toast.show({
            type: "error",
            text1: t("alerts.errorTitle"),
            text2: t("alerts.errorMessage"),
          });
        },
      });
    }
  };

  const closeDialog = () => {
    reset();
    onDismiss();
  };

  const isLoading =
    createPaymentMethod.isPending || updatePaymentMethod.isPending;

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <View style={styles.overlayRoot}>
        <Pressable style={styles.backdrop} onPress={closeDialog} />
        <View style={styles.center} pointerEvents="box-none">
          <View style={styles.card}>
            <Text style={styles.dialogTitle}>
              {method ? t("methodsForm.editTitle") : t("methodsForm.title")}
            </Text>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#ff7f50" />
                </View>
              ) : (
                <>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder={t("methodsForm.titlePlaceholder")}
                          activeUnderlineColor="#ff7f50"
                          textColor="black"
                          value={value}
                          style={styles.input}
                          onChangeText={onChange}
                        />
                        {error && (
                          <HelperText type="error">
                            {t("methodsForm.requiredError")}
                          </HelperText>
                        )}
                      </View>
                    )}
                  />

                  <Controller
                    name="bank"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <View>
                        <BankSelectField
                          selectedBank={value}
                          onSelectBank={onChange}
                        />
                        {error && (
                          <HelperText type="error">
                            {t("methodsForm.requiredError")}
                          </HelperText>
                        )}
                      </View>
                    )}
                  />

                  <Controller
                    name="method"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SelectField
                        value={value}
                        placeholder={t("methodsForm.paymentTypePlaceholder")}
                        onSelect={onChange}
                        options={[
                          {
                            value: "transferencia",
                            label: t("methodsForm.transfer"),
                          },
                          {
                            value: "pago_movil",
                            label: t("methodsForm.mobile"),
                          },
                        ]}
                      />
                    )}
                  />

                  <Controller
                    name="idNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder={t(
                            "methodsForm.identityNumberPlaceholder",
                          )}
                          activeUnderlineColor="#ff7f50"
                          textColor="black"
                          inputMode="numeric"
                          value={value}
                          style={styles.input}
                          onChangeText={onChange}
                        />
                        {error && (
                          <HelperText type="error">
                            {t("methodsForm.requiredError")}
                          </HelperText>
                        )}
                      </View>
                    )}
                  />

                  {paymentType === "transferencia" && (
                    <>
                      <Controller
                        name="accountType"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <SelectField
                            value={value || "ahorro"}
                            placeholder={t(
                              "methodsForm.accountTypePlaceholder",
                            )}
                            onSelect={onChange}
                            options={[
                              {
                                value: "corriente",
                                label: t("methodsForm.current"),
                              },
                              {
                                value: "ahorro",
                                label: t("methodsForm.savings"),
                              },
                            ]}
                          />
                        )}
                      />

                      <Controller
                        name="accountNumber"
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <View style={styles.inputContainer}>
                            <TextInput
                              placeholder={t(
                                "methodsForm.accountNumberPlaceholder",
                              )}
                              activeUnderlineColor="#ff7f50"
                              textColor="black"
                              inputMode="numeric"
                              value={value}
                              style={styles.input}
                              onChangeText={onChange}
                            />
                            {error && (
                              <HelperText type="error">
                                {t("methodsForm.requiredError")}
                              </HelperText>
                            )}
                          </View>
                        )}
                      />
                    </>
                  )}

                  {paymentType === "pago_movil" && (
                    <Controller
                      name="phoneNumber"
                      control={control}
                      rules={{ required: true }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <View style={styles.inputContainer}>
                          <TextInput
                            placeholder={t(
                              "methodsForm.phoneNumberPlaceholder",
                            )}
                            activeUnderlineColor="#ff7f50"
                            textColor="black"
                            inputMode="numeric"
                            value={value}
                            style={styles.input}
                            onChangeText={onChange}
                          />
                          {error && (
                            <HelperText type="error">
                              {t("methodsForm.requiredError")}
                            </HelperText>
                          )}
                        </View>
                      )}
                    />
                  )}
                </>
              )}
            </ScrollView>
            <View style={styles.actions}>
              <Button
                onPress={closeDialog}
                textColor="#ff7f50"
                mode="outlined"
                style={formStyles.cancelButton}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onPress={handleSubmit(onSubmit)}
                mode="outlined"
                textColor="#fff"
                style={formStyles.confirmButton}
                disabled={isLoading}
              >
                {method ? t("common.save") : t("common.create")}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Portal>
  );
};

export default PaymentMethodForm;

const styles = StyleSheet.create({
  overlayRoot: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "90%",
    overflow: "hidden",
  },
  dialogTitle: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "transparent",
  },
  loadingContainer: {
    padding: 24,
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
