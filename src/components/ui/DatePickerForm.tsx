import React, { useState } from "react";
import { View, StyleSheet, Platform, Pressable } from "react-native";
import { TextInput, Portal, Dialog, Button } from "react-native-paper";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

interface DateInputFieldProps {
  label: string;
  date: Date;
  onChange: (date: Date) => void;
}

const DateInputField: React.FC<DateInputFieldProps> = ({
  date,
  label,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const { t } = useTranslation();
  const androidPickerProps =
    Platform.OS === "android"
      ? {
          // Force action buttons to match app accent color on Android.
          positiveButton: { label: t("common.confirm"), textColor: "#ff7f50" },
          negativeButton: { label: t("common.cancel"), textColor: "#ff7f50" },
        }
      : {};

  const handleConfirm = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <Pressable onPress={() => setShowPicker(true)}>
        <TextInput
          label={label}
          onPress={() => setShowPicker(true)}
          value={date.toLocaleDateString()}
          activeUnderlineColor="#ff7f50"
          textColor="black"
          placeholder={t("common.selectDate")}
          editable={false} // Asegura que no sea editable para evitar errores
          style={styles.input}
        />
      </Pressable>

      {showPicker &&
        (Platform.OS === "ios" ? (
          <Portal>
            <Dialog
              visible={showPicker}
              onDismiss={() => setShowPicker(false)}
              theme={{ colors: { backdrop: "#00000040" } }}
            >
              <Dialog.Title>{t("common.selectADate")}</Dialog.Title>
              <Dialog.Content>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleConfirm}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowPicker(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onPress={() => setShowPicker(false)}>
                  {t("common.confirm")}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        ) : (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleConfirm}
            {...androidPickerProps}
          />
        ))}
    </View>
  );
};

export default DateInputField;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
  },
});
