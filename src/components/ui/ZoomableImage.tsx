import React, { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type ImageStyle,
} from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";

type ZoomableImageProps = {
  uri: string;
  style?: StyleProp<ImageStyle>;
};

function clampPan(value: number, size: number, currentScale: number) {
  "worklet";
  const limit = (size * Math.max(currentScale - 1, 0)) / 2;
  return Math.min(limit, Math.max(-limit, value));
}

const ZoomableImage = ({ uri, style }: ZoomableImageProps) => {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const reset = () => {
    scale.value = 1;
    savedScale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    savedX.value = 0;
    savedY.value = 0;
  };

  const openViewer = () => {
    reset();
    setOpen(true);
  };

  const closeViewer = () => {
    setOpen(false);
    reset();
  };

  const gesture = useMemo(() => {
    const pinch = Gesture.Pinch()
      .onUpdate((event) => {
        scale.value = Math.min(4, Math.max(1, savedScale.value * event.scale));
      })
      .onEnd(() => {
        savedScale.value = scale.value;
        translateX.value = clampPan(translateX.value, width, scale.value);
        translateY.value = clampPan(translateY.value, height, scale.value);
        savedX.value = translateX.value;
        savedY.value = translateY.value;
      });

    const pan = Gesture.Pan()
      .onUpdate((event) => {
        translateX.value = clampPan(
          savedX.value + event.translationX,
          width,
          scale.value,
        );
        translateY.value = clampPan(
          savedY.value + event.translationY,
          height,
          scale.value,
        );
      })
      .onEnd(() => {
        savedX.value = translateX.value;
        savedY.value = translateY.value;
      });

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        if (scale.value > 1) {
          scale.value = withTiming(1);
          savedScale.value = 1;
          translateX.value = withTiming(0);
          translateY.value = withTiming(0);
          savedX.value = 0;
          savedY.value = 0;
          return;
        }
        scale.value = withTiming(2.5);
        savedScale.value = 2.5;
      });

    return Gesture.Simultaneous(pinch, pan, doubleTap);
  }, [height, savedScale, savedX, savedY, scale, translateX, translateY, width]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View>
      <Pressable
        onPress={openViewer}
        accessibilityRole="imagebutton"
        accessibilityLabel={t("common.viewFullImage")}
      >
        <Image source={{ uri }} style={style} resizeMode="contain" />
      </Pressable>
      <Text style={styles.hint}>{t("common.viewFullImage")}</Text>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeViewer}
      >
        <GestureHandlerRootView style={styles.viewer}>
          <GestureDetector gesture={gesture}>
            <Animated.Image
              source={{ uri }}
              resizeMode="contain"
              style={[{ width, height }, imageStyle]}
            />
          </GestureDetector>
          <Pressable
            style={[styles.close, { top: insets.top + 12 }]}
            onPress={closeViewer}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
          >
            <X size={22} color="#fff" />
          </Pressable>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

export default ZoomableImage;

const styles = StyleSheet.create({
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: "#888",
  },
  viewer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  close: {
    position: "absolute",
    zIndex: 2,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
});
