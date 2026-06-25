import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Dialog, HelperText, Portal, Text } from "react-native-paper";
import SelectButton from "./SelectButton";
import { useBanks } from "../../services/bank";
import { useTranslation } from "react-i18next";

interface BankSelectFieldProps {
  selectedBank: string;
  onSelectBank: (bankId: string) => void;
}

const BankSelectField: React.FC<BankSelectFieldProps> = ({
  selectedBank,
  onSelectBank,
}) => {
  const { t } = useTranslation();
  const { data: banks, isLoading } = useBanks();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <SelectButton
        value={banks?.find((b) => b._id === selectedBank)?.name || ""}
        placeholder={t("methodsForm.bankPlaceholder")}
        onPress={() => setMenuVisible(true)}
      />

      <Portal>
        <Dialog
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          style={styles.dialog}
          theme={{ colors: { backdrop: "#ff7f50" } }}
        >
          <Dialog.Title>{t("methodsForm.bankPlaceholder")}</Dialog.Title>
          <Dialog.Content>
            {isLoading ? (
              <HelperText type="info">{t("common.loading")}</HelperText>
            ) : (
              <ScrollView style={styles.listContainer}>
                {banks?.map((bank) => (
                  <TouchableOpacity
                    key={bank._id}
                    onPress={() => {
                      onSelectBank(bank._id);
                      setMenuVisible(false);
                    }}
                    style={styles.bankItem}
                  >
                    <Text style={styles.menuItem}>{`(${bank.code}) ${bank.name}`}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

export default BankSelectField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  dialog: {
    backgroundColor: "#fff",
  },
  listContainer: {
    maxHeight: 280,
  },
  bankItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItem: {
    color: "#333",
    fontSize: 16,
  },
});
