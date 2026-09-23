import React from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Camera, Image as ImageIcon } from "lucide-react-native";

type ImageSourceSheetProps = {
  visible: boolean;
  onCamera: () => void;
  onLibrary: () => void;
  onDismiss: () => void;
};

const ImageSourceSheet: React.FC<ImageSourceSheetProps> = ({
  visible,
  onCamera,
  onLibrary,
  onDismiss,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.overlayRoot}>
        <Pressable style={styles.backdrop} onPress={onDismiss} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Text style={styles.title}>{t("ProfileEdit.sourceTitle")}</Text>
          <TouchableOpacity style={styles.cameraButton} onPress={onCamera} activeOpacity={0.85}>
            <Camera size={22} color="#fff" />
            <Text style={styles.cameraLabel}>{t("ProfileEdit.takePhoto")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.libraryButton} onPress={onLibrary} activeOpacity={0.7}>
            <ImageIcon size={16} color="#888" />
            <Text style={styles.libraryLabel}>{t("ProfileEdit.pickFromDevice")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onDismiss} hitSlop={8}>
            <Text style={styles.cancelLabel}>{t("common.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Portal>
  );
};

export default ImageSourceSheet;

const styles = StyleSheet.create({
  overlayRoot: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#ff7f50",
    borderRadius: 10,
    paddingVertical: 16,
  },
  cameraLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  libraryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingVertical: 6,
  },
  libraryLabel: {
    color: "#888",
    fontSize: 13,
  },
  cancelButton: {
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
  },
  cancelLabel: {
    color: "#ff7f50",
    fontSize: 14,
    fontWeight: "600",
  },
});
