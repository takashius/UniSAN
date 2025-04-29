import { t } from "i18next";
import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Card } from "react-native-paper";

interface ConfirmationDialogProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ visible, message, onConfirm, onCancel }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (<>
    {visible &&
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.message}>{message}</Text>
          </Card.Content>
          <Card.Actions>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>{t("common.accept")}</Text>
            </TouchableOpacity>
          </Card.Actions>
        </Card>
      </Animated.View>
    }
  </>
  );
};

export default ConfirmationDialog;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 1000,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#ff7f50",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#ff7f50",
    borderRadius: 5,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});