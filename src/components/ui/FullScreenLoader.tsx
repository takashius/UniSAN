import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

type FullScreenLoaderProps = {
  visible: boolean;
};

/**
 * Overlay de carga a pantalla completa.
 * Usa el ActivityIndicator nativo: el de react-native-paper dibuja dos
 * semicírculos y, con la arquitectura nueva, se ve cortado.
 */
const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={styles.overlay} pointerEvents="auto">
        <View style={styles.box}>
          <ActivityIndicator size="large" color="#ff7f50" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  box: {
    minWidth: 72,
    minHeight: 72,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FullScreenLoader;
