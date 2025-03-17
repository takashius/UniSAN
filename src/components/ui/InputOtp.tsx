import React, { forwardRef, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableWithoutFeedback,
} from "react-native";

interface OTPInputProps {
  value: string;
  length: number;
  onChangeText: (value: string) => void;
  isDisabled?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

const InputOTP = forwardRef<TextInput, OTPInputProps>(
  ({ value, length, onChangeText, isDisabled = false, containerStyle, inputStyle }, ref) => {
    const hiddenInputRef = useRef<TextInput | null>(null) as React.MutableRefObject<TextInput | null>;

    const handleFocus = () => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus(); // Establece el foco en el TextInput
      }
    };

    const characters = value.padEnd(length, " ").split("");

    return (
      <TouchableWithoutFeedback onPress={handleFocus}>
        <View style={[styles.container, isDisabled && styles.disabled, containerStyle]}>
          {characters.map((char, index) => (
            <InputOTPSlot
              key={index}
              char={char}
              isActive={index === value.length}
              style={inputStyle}
              onPress={handleFocus}
            />
          ))}

          {/* TextInput oculto para capturar el texto */}
          <TextInput
            ref={(textInputRef) => {
              hiddenInputRef.current = textInputRef; // Uso seguro de la referencia
              if (ref && typeof ref === "function") {
                ref(textInputRef);
              } else if (ref && typeof ref === "object" && ref.current !== undefined) {
                ref.current = textInputRef;
              }
            }}
            value={value}
            onChangeText={onChangeText}
            maxLength={length}
            keyboardType="numeric"
            style={styles.hiddenInput}
            editable={!isDisabled}
            autoFocus={false}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
);


InputOTP.displayName = "InputOTP";

interface OTPInputSlotProps {
  char: string;
  isActive: boolean;
  style?: ViewStyle;
  onPress: () => void; // Se añade el onPress para permitir interacción
}

const InputOTPSlot: React.FC<OTPInputSlotProps> = ({ char, isActive, style, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.slot, isActive && styles.activeSlot, style]}>
        <Text style={styles.char}>{char.trim()}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

InputOTPSlot.displayName = "InputOTPSlot";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  slot: {
    height: 48,
    width: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  activeSlot: {
    borderColor: "#ff7f50",
    borderWidth: 2,
  },
  char: {
    fontSize: 18,
    color: "#333",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    top: 0,
    left: 0,
    height: 1,
    width: 1,
  },
});

export { InputOTP, InputOTPSlot };
