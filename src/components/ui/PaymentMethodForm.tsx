import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, HelperText, Menu, Portal, Dialog } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import SelectButton from "./SelectButton";

interface PaymentMethodFormProps {
  visible: boolean;
  onDismiss: () => void;
}

interface FormData {
  title: string;
  bank: string;
  paymentType: "transferencia" | "movil";
  identityNumber: string;
  accountType?: string;
  accountNumber?: string;
  phoneNumber?: string;
}

const banks = [
  "Banco Nacional",
  "Banesco",
  "Mercantil",
  "Provincial",
  "Banco de Venezuela",
  "BOD",
  "Banco Exterior",
  "Bancaribe",
];

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ visible, onDismiss }) => {
  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    defaultValues: {
      title: "",
      bank: "",
      paymentType: "transferencia",
      identityNumber: "",
      accountType: "corriente",
      accountNumber: "",
      phoneNumber: "",
    },
  });

  const paymentType = watch("paymentType");
  const [menuBankVisible, setMenuBankVisible] = useState(false);
  const [menuPaymentTypeVisible, setMenuPaymentTypeVisible] = useState(false);
  const [menuAccountTypeVisible, setMenuAccountTypeVisible] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log("Formulario enviado:", data);
    reset();
    onDismiss();
  };

  const closeDialog = () => {
    reset();
    onDismiss();
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={closeDialog}
        style={styles.dialog}
        theme={{ colors: { backdrop: '#ff7f50' } }}
      >
        <Dialog.Title style={styles.dialogTitle}>Agregar método de pago</Dialog.Title>
        <Dialog.Content>
          {/* Título del método de pago */}
          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Título del método de pago"
                  activeUnderlineColor="#ff7f50"
                  textColor="black"
                  value={value}
                  style={styles.input}
                  onChangeText={onChange}
                />
                {error && <HelperText type="error">Este campo es obligatorio</HelperText>}
              </View>
            )}
          />

          {/* Banco */}
          <Controller
            name="bank"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View style={styles.inputContainer}>
                <Menu
                  visible={menuBankVisible}
                  onDismiss={() => setMenuBankVisible(false)}
                  anchor={
                    <SelectButton
                      value={value}
                      placeholder="Selecciona un banco"
                      onPress={() => setMenuBankVisible(true)}
                    />
                  }
                >
                  {banks.map((bank) => (
                    <Menu.Item
                      key={bank}
                      title={bank}
                      onPress={() => {
                        onChange(bank);
                        setMenuBankVisible(false);
                      }}
                      titleStyle={styles.menuItem}
                    />
                  ))}
                </Menu>
                {error && <HelperText type="error">Este campo es obligatorio</HelperText>}
              </View>
            )}
          />

          {/* Tipo de pago */}
          <Controller
            name="paymentType"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Menu
                  visible={menuPaymentTypeVisible}
                  onDismiss={() => setMenuPaymentTypeVisible(false)}
                  anchor={
                    <SelectButton
                      value={value === "transferencia" ? "Transferencia" : "Pago Móvil"}
                      placeholder="Selecciona un tipo de pago"
                      onPress={() => setMenuPaymentTypeVisible(true)}
                    />
                  }
                >
                  <Menu.Item
                    title="Transferencia"
                    onPress={() => {
                      onChange("transferencia");
                      setMenuPaymentTypeVisible(false);
                    }}
                    titleStyle={styles.menuItem}
                  />
                  <Menu.Item
                    title="Pago Móvil"
                    onPress={() => {
                      onChange("movil");
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
            name="identityNumber"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Número de Cédula"
                  activeUnderlineColor="#ff7f50"
                  textColor="black"
                  inputMode="numeric"
                  value={value}
                  style={styles.input}
                  onChangeText={onChange}
                />
                {error && <HelperText type="error">Este campo es obligatorio</HelperText>}
              </View>
            )}
          />

          {/* Campos condicionales */}
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
                          value={value === "corriente" ? "Corriente" : "Ahorro"}
                          placeholder="Selecciona un tipo de cuenta"
                          onPress={() => setMenuAccountTypeVisible(true)}
                        />
                      }
                    >
                      <Menu.Item
                        title="Corriente"
                        onPress={() => {
                          onChange("corriente");
                          setMenuAccountTypeVisible(false);
                        }}
                        titleStyle={styles.menuItem}
                      />
                      <Menu.Item
                        title="Ahorro"
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
                      placeholder="Número de cuenta"
                      activeUnderlineColor="#ff7f50"
                      textColor="black"
                      inputMode="numeric"
                      value={value}
                      style={styles.input}
                      onChangeText={onChange}
                    />
                    {error && <HelperText type="error">Este campo es obligatorio</HelperText>}
                  </View>
                )}
              />
            </>
          )}

          {paymentType === "movil" && (
            <Controller
              name="phoneNumber"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Número de teléfono"
                    activeUnderlineColor="#ff7f50"
                    textColor="black"
                    inputMode="tel"
                    value={value}
                    style={styles.input}
                    onChangeText={onChange}
                  />
                  {error && <HelperText type="error">Este campo es obligatorio</HelperText>}
                </View>
              )}
            />
          )}
        </Dialog.Content>

        <Dialog.Actions style={styles.actions}>
          <Button
            mode="outlined"
            style={styles.cancelButton}
            onPress={closeDialog}
            textColor="#ff7f50"
          >
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
            Guardar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default PaymentMethodForm;

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "#ffffff",
  },
  dialogTitle: {
    color: "#ff7f50",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    paddingHorizontal: 8,
  },
  actions: {
    justifyContent: "space-between",
  },
  cancelButton: {
    borderColor: "#ff7f50",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#ff7f50",
  },
  menuItem: {
    color: "#000000",
    textAlign: "left",
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});