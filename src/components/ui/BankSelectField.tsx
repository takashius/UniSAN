import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Menu, HelperText } from "react-native-paper";
import SelectButton from "./SelectButton";
import { useBanks } from "../../services/bank";
import { useTranslation } from "react-i18next";

interface BankSelectFieldProps {
  selectedBank: string;
  onSelectBank: (bankId: string) => void;
}

const BankSelectField: React.FC<BankSelectFieldProps> = ({ selectedBank, onSelectBank }) => {
  const { t } = useTranslation();
  const { data: banks, isLoading } = useBanks();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <SelectButton
            value={banks?.find((b) => b._id === selectedBank)?.name || ""}
            placeholder={t("methodsForm.bankPlaceholder")}
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        {isLoading ? (
          <HelperText type="info">{t("common.loading")}</HelperText>
        ) : (
          banks?.map((bank) => (
            <Menu.Item
              key={bank._id}
              title={`(${bank.code}) ${bank.name}`}
              onPress={() => {
                onSelectBank(bank._id);
                setMenuVisible(false);
              }}
              titleStyle={styles.menuItem}
            />
          ))
        )}
      </Menu>
    </View>
  );
};

export default BankSelectField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  menuItem: {
    color: "#333",
    fontSize: 16,
  },
});