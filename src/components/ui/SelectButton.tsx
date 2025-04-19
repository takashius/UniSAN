import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronDown } from "lucide-react-native";

interface SelectButtonProps {
  value: string | null;
  placeholder: string;
  onPress: () => void;
}

const SelectButton: React.FC<SelectButtonProps> = ({ value, placeholder, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.selectButton}>
      <Text style={styles.text}>{value || placeholder}</Text>
      <ChevronDown style={styles.icon} size={20} color="#404040" />
    </TouchableOpacity>
  );
};

export default SelectButton;

const styles = StyleSheet.create({
  selectButton: {
    borderBottomWidth: 1,
    borderColor: "#a0a0a0",
    backgroundColor: "transparent",
    paddingBottom: 12,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#404040",
    fontSize: 16,
    textAlign: "left",
    marginLeft: 7,
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
});