import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, HelperText, Menu, Portal, Dialog, ActivityIndicator } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import SelectButton from "./SelectButton";
import { useTranslation } from "react-i18next";
import { useCreatePaymentMethod, useUpdatePaymentMethod } from "../../services/paymentMethod";
import { PaymentMethod, PaymentMethodCreate } from "../../types/paymentMethod";
import Toast from "react-native-toast-message";
import BankSelectField from "./BankSelectField";
import formStyles from "../../styles/FormStyles";

interface PaymentMethodFormProps {
  visible: boolean;
  onDismiss: () => void;
  method?: PaymentMethod;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ visible, onDismiss, method }) => {
  const { control, handleSubmit, watch, reset, setValue } = useForm<PaymentMethodCreate>({
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
  const [menuPaymentTypeVisible, setMenuPaymentTypeVisible] = useState(false);
  const [menuAccountTypeVisible, setMenuAccountTypeVisible] = useState(false);

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
        }
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

  const isLoading = createPaymentMethod.isPending || updatePaymentMethod.isPending;

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={closeDialog}
        style={styles.dialog}
        theme={{ colors: { backdrop: "#ff7f50" } }}
      >
        <Dialog.Title style={styles.dialogTitle}>
          {method ? t("methodsForm.editTitle") : t("methodsForm.title")}
        </Dialog.Title>
        <Dialog.Content>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff7f50" />
            </View>
          ) : (
            <>
              {/* Título del método de pago */}
              <Controller
                name="title"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t("methodsForm.titlePlaceholder")}
                      activeUnderlineColor="#ff7f50"
                      textColor="black"
                      value={value}
                      style={styles.input}
                      onChangeText={onChange}
                    />
                    {error && <HelperText type="error">{t("methodsForm.requiredError")}</HelperText>}
                  </View>
                )}
              />

              {/* Banco */}
              <Controller
                name="bank"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View>
                    <BankSelectField selectedBank={value} onSelectBank={onChange} />
                    {error && <HelperText type="error">{t("methodsForm.requiredError")}</HelperText>}
                  </View>
                )}
              />

              {/* Tipo de pago */}
              <Controller
                name="method"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputContainer}>
                    <Menu
                      visible={menuPaymentTypeVisible}
                      onDismiss={() => setMenuPaymentTypeVisible(false)}
                      anchor={
                        <SelectButton
                          value={value === "transferencia" ? t("methodsForm.transfer") : t("methodsForm.mobile")}
                          placeholder={t("methodsForm.paymentTypePlaceholder")}
                          onPress={() => setMenuPaymentTypeVisible(true)}
                        />
                      }
                    >
                      <Menu.Item
                        title={t("methodsForm.transfer")}
                        onPress={() => {
                          onChange("transferencia");
                          setMenuPaymentTypeVisible(false);
                        }}
                        titleStyle={styles.menuItem}
                      />
                      <Menu.Item
                        title={t("methodsForm.mobile")}
                        onPress={() => {
                          onChange("pago_movil");
                          setMenuPaymentTypeVisible(false);
                        }}
                        titleStyle={styles.menuItem}
                      />
                    </Menu>
                  </View>
                )}
              />

              {/* Número de Cédula */}
              <Controller
                name="idNumber"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={t("methodsForm.identityNumberPlaceholder")}
                      activeUnderlineColor="#ff7f50"
                      textColor="black"
                      inputMode="numeric"
                      value={value}
                      style={styles.input}
                      onChangeText={onChange}
                    />
                    {error && <HelperText type="error">{t("methodsForm.requiredError")}</HelperText>}
                  </View>
                )}
              />

              {/* Campos Condicionales */}
              {paymentType === "transferencia" && (
                <>
                  {/* Tipo de cuenta */}
                  <Controller
                    name="accountType"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.inputContainer}>
                        <Menu
                          visible={menuAccountTypeVisible}
                          onDismiss={() => setMenuAccountTypeVisible(false)}
                          anchor={
                            <SelectButton
                              value={value === "corriente" ? t("methodsForm.current") : t("methodsForm.savings")}
                              placeholder={t("methodsForm.accountTypePlaceholder")}
                              onPress={() => setMenuAccountTypeVisible(true)}
                            />
                          }
                        >
                          <Menu.Item
                            title={t("methodsForm.current")}
                            onPress={() => {
                              onChange("corriente");
                              setMenuAccountTypeVisible(false);
                            }}
                            titleStyle={styles.menuItem}
                          />
                          <Menu.Item
                            title={t("methodsForm.savings")}
                            onPress={() => {
                              onChange("ahorro");
                              setMenuAccountTypeVisible(false);
                            }}
                            titleStyle={styles.menuItem}
                          />
                        </Menu>
                      </View>
                    )}
                  />

                  {/* Número de cuenta */}
                  <Controller
                    name="accountNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder={t("methodsForm.accountNumberPlaceholder")}
                          activeUnderlineColor="#ff7f50"
                          textColor="black"
                          inputMode="numeric"
                          value={value}
                          style={styles.input}
                          onChangeText={onChange}
                        />
                        {error && <HelperText type="error">{t("methodsForm.requiredError")}</HelperText>}
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
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        placeholder={t("methodsForm.phoneNumberPlaceholder")}
                        activeUnderlineColor="#ff7f50"
                        textColor="black"
                        inputMode="numeric"
                        value={value}
                        style={styles.input}
                        onChangeText={onChange}
                      />
                      {error && <HelperText type="error">{t("methodsForm.requiredError")}</HelperText>}
                    </View>
                  )}
                />
              )}
            </>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={closeDialog}
            textColor="#ff7f50"
            mode="outlined"
            style={formStyles.cancelButton}>
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
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default PaymentMethodForm;

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  dialogTitle: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "transparent",
  },
  menuItem: {
    color: "#333",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});