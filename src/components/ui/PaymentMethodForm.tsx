import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, HelperText, Menu, Portal, Dialog } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";

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
                    <Button
                      mode="outlined"
                      onPress={() => setMenuBankVisible(true)}
                      style={styles.selectButton}
                    >
                      {value || "Selecciona un banco"}
                    </Button>
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
                    <Button
                      mode="outlined"
                      onPress={() => setMenuPaymentTypeVisible(true)}
                      style={styles.selectButton}
                    >
                      {value === "transferencia" ? "Transferencia" : "Pago Móvil"}
                    </Button>
                  }
                >
                  <Menu.Item
                    title="Transferencia"
                    onPress={() => {
                      onChange("transferencia");
                      setMenuPaymentTypeVisible(false);
                    }}
                  />
                  <Menu.Item
                    title="Pago Móvil"
                    onPress={() => {
                      onChange("movil");
                      setMenuPaymentTypeVisible(false);
                    }}
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
                        <Button
                          mode="outlined"
                          onPress={() => setMenuAccountTypeVisible(true)}
                          style={styles.selectButton}
                        >
                          {value === "corriente" ? "Corriente" : "Ahorro"}
                        </Button>
                      }
                    >
                      <Menu.Item
                        title="Corriente"
                        onPress={() => {
                          onChange("corriente");
                          setMenuAccountTypeVisible(false);
                        }}
                      />
                      <Menu.Item
                        title="Ahorro"
                        onPress={() => {
                          onChange("ahorro");
                          setMenuAccountTypeVisible(false);
                        }}
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
  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
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
});