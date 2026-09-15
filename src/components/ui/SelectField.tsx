import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { HelperText, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import SelectButton from "./SelectButton";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value: string;
  placeholder: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  loading?: boolean;
  maxListHeight?: number;
}

const SelectField: React.FC<SelectFieldProps> = ({
  value,
  placeholder,
  options,
  onSelect,
  loading = false,
  maxListHeight = 180,
}) => {
  const { t } = useTranslation();
  const [listVisible, setListVisible] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label || "";

  return (
    <View style={styles.container}>
      <SelectButton
        value={selectedLabel}
        placeholder={placeholder}
        onPress={() => setListVisible((visible) => !visible)}
      />

      {listVisible && (
        <View style={styles.list}>
          {loading ? (
            <HelperText type="info">{t("common.loading")}</HelperText>
          ) : (
            <ScrollView
              style={[styles.listContainer, { maxHeight: maxListHeight }]}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {options.map((option, index) => {
                const selected = option.value === value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      onSelect(option.value);
                      setListVisible(false);
                    }}
                    style={[
                      styles.item,
                      selected && styles.itemSelected,
                      index === options.length - 1 && styles.itemLast,
                    ]}
                  >
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default SelectField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  list: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  listContainer: {
    maxHeight: 180,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemSelected: {
    backgroundColor: "#fff4ee",
  },
  itemText: {
    color: "#333",
    fontSize: 16,
  },
  itemTextSelected: {
    color: "#ff7f50",
    fontWeight: "600",
  },
});
