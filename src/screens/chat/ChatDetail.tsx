import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Bell, BellOff, ChevronLeft, Send } from "lucide-react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { useUser } from "../../context/UserContext";
import { useSanDetail } from "../../services/san";
import {
  ChatMessageItem,
  connectChatSocket,
  emitChatMessage,
  useChatMessages,
  useChatRooms,
  useSetChatMuted,
} from "../../services/chat";
import { setActiveChatSanId } from "../../services/notifications";
import AvatarView from "../../components/ui/AvatarView";
import FullScreenLoader from "../../components/ui/FullScreenLoader";

function findTabNavigation(navigation: NavigationProp<ParamListBase>) {
  let current = navigation.getParent();
  while (current) {
    if (current.getState()?.type === "tab") return current;
    current = current.getParent();
  }
  return navigation.getParent();
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const ChatDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: sanDetails } = useSanDetail(id);
  const { data: rooms } = useChatRooms();
  const { data: messages, isLoading, isError } = useChatMessages(id);
  const muteRoom = useSetChatMuted();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const holdFocus = useRef(false);
  const stickToBottom = useRef(true);
  const tabBarHeight = useBottomTabBarHeight();
  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });
  const composerStyle = useAnimatedStyle(() => {
    const lift = Math.max(0, keyboard.height.value - tabBarHeight);
    return { paddingBottom: lift };
  });
  const room = rooms?.find((item) => String(item.id) === String(id));
  const title = room?.sanName || sanDetails?.sanName || "";
  const muted = room?.muted === true;
  const myId = user?.user.id;

  useFocusEffect(
    useCallback(() => {
      setActiveChatSanId(id);
      return () => setActiveChatSanId(null);
    }, [id]),
  );

  useEffect(() => {
    let active = true;
    let detach = () => {};

    void (async () => {
      const socket = await connectChatSocket();
      if (!active || !socket) return;
      const onMessage = (message: ChatMessageItem) => {
        if (String(message.sanId) !== String(id)) return;
        queryClient.setQueryData<ChatMessageItem[]>(
          ["chatMessages", id],
          (current) => {
            if (!current) return [message];
            if (current.some((item) => item.id === message.id)) return current;
            return [...current, message];
          },
        );
        void queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      };
      socket.on("newMessage", onMessage);
      socket.emit("joinSan", id);
      detach = () => socket.off("newMessage", onMessage);
    })();

    return () => {
      active = false;
      detach();
    };
  }, [id, queryClient]);

  const scrollMessagesToEnd = () => {
    stickToBottom.current = true;
    scrollRef.current?.scrollToEnd({ animated: false });
  };

  useAnimatedReaction(
    () => keyboard.height.value,
    (height, previous) => {
      if (height > 0 && (previous ?? 0) === 0) {
        runOnJS(scrollMessagesToEnd)();
      }
    },
  );

  useEffect(() => {
    stickToBottom.current = true;
  }, [id]);

  useEffect(() => {
    if (isLoading || !messages?.length) return;
    const timers = [0, 60, 200].map((delay) =>
      setTimeout(() => {
        if (!stickToBottom.current) return;
        scrollRef.current?.scrollToEnd({ animated: false });
      }, delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [id, isLoading, messages?.length]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    holdFocus.current = true;
    stickToBottom.current = true;
    setSending(true);
    try {
      await connectChatSocket();
      const response = await emitChatMessage(id, text);
      if (response.error) {
        Toast.show({ type: "error", text1: t("Chat.sendError") });
        return;
      }
      setDraft("");
      inputRef.current?.focus();
      if (response.message) {
        queryClient.setQueryData<ChatMessageItem[]>(
          ["chatMessages", id],
          (current) => {
            const next = response.message as ChatMessageItem;
            if (!current) return [next];
            if (current.some((item) => item.id === next.id)) return current;
            return [...current, next];
          },
        );
      }
    } catch {
      Toast.show({ type: "error", text1: t("Chat.sendError") });
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const releaseFocus = () => {
    if (!holdFocus.current) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  useLayoutEffect(() => {
    const parent = findTabNavigation(navigation);
    parent?.setOptions({
      headerTitle: () => (
        <Text numberOfLines={1} style={styles.navTitle}>
          {title || t("Navigation.chat")}
        </Text>
      ),
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
          accessibilityLabel={t("Chat.back")}
          style={styles.navButton}
        >
          <ChevronLeft size={26} color="#fff" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => muteRoom.mutate({ sanId: id, muted: !muted })}
          accessibilityLabel={muted ? t("Chat.unmute") : t("Chat.mute")}
          style={styles.navButton}
        >
          {muted ? (
            <BellOff size={22} color="#fff" />
          ) : (
            <Bell size={22} color="#fff" />
          )}
        </TouchableOpacity>
      ),
    });
  }, [id, muted, muteRoom, navigation, t, title]);

  useFocusEffect(
    useCallback(() => {
      const parent = findTabNavigation(navigation);
      const state = parent?.getState();
      const routeName = state?.routes[state.index]?.name;
      return () => {
        if (!parent) return;
        const titles: Record<string, string> = {
          UNISAN: t("Navigation.home"),
          Chat: t("Navigation.chat"),
          Explorer: t("Navigation.explorer"),
          History: t("Navigation.history"),
          Profile: t("Navigation.profile"),
        };
        parent.setOptions({
          headerTitle: (routeName && titles[routeName]) || t("Navigation.chat"),
          headerTitleAlign: Platform.OS === "ios" ? "center" : "left",
          headerLeft: () => null,
          headerRight: () => null,
        });
      };
    }, [navigation, t]),
  );

  return (
    <Animated.View style={[styles.container, composerStyle]}>
      <FullScreenLoader visible={isLoading} />

      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        scrollEventThrottle={16}
        onContentSizeChange={() => {
          if (!stickToBottom.current) return;
          scrollRef.current?.scrollToEnd({ animated: false });
        }}
        onScrollEndDrag={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const distanceFromBottom =
            contentSize.height - layoutMeasurement.height - contentOffset.y;
          stickToBottom.current = distanceFromBottom < 48;
        }}
        onMomentumScrollEnd={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const distanceFromBottom =
            contentSize.height - layoutMeasurement.height - contentOffset.y;
          stickToBottom.current = distanceFromBottom < 48;
        }}
      >
        {isError ? (
          <Text style={styles.statusText}>{t("Chat.unavailable")}</Text>
        ) : messages && messages.length === 0 ? (
          <Text style={styles.statusText}>{t("Chat.noMessages")}</Text>
        ) : (
          (messages || []).map((message, index, list) => {
            const isMe = String(message.user.id) === String(myId);
            const previous = list[index - 1];
            const isGroupStart =
              !previous || String(previous.user.id) !== String(message.user.id);
            const sender = `${message.user.name || ""} ${message.user.lastName || ""}`.trim();
            return (
              <View
                key={message.id}
                style={[
                  styles.message,
                  isGroupStart ? styles.messageGroupStart : styles.messageGrouped,
                  isMe ? styles.messageRight : styles.messageLeft,
                ]}
              >
                {!isMe ? (
                  <View style={styles.avatarSlot}>
                    {isGroupStart ? (
                      <AvatarView
                        name={message.user.name}
                        lastName={message.user.lastName}
                        photo={message.user.photo}
                      />
                    ) : null}
                  </View>
                ) : null}
                <View style={[styles.bubbleColumn, isMe && styles.bubbleColumnMe]}>
                  {!isMe && isGroupStart && sender ? (
                    <Text style={styles.senderName}>{sender}</Text>
                  ) : null}
                  <View
                    style={[
                      styles.messageBubble,
                      isMe ? styles.myMessage : styles.otherMessage,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageContent,
                        isMe ? styles.myContent : styles.otherContent,
                      ]}
                    >
                      {message.text}
                    </Text>
                    <Text
                      style={[
                        styles.messageTimestamp,
                        isMe ? styles.myTimestamp : styles.otherTimestamp,
                      ]}
                    >
                      {formatTime(message.sentAt)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.messageInputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={t("Chat.placeholder")}
          value={draft}
          onChangeText={setDraft}
          blurOnSubmit={false}
          returnKeyType="send"
          onSubmitEditing={() => void send()}
          onFocus={() => {
            holdFocus.current = false;
          }}
          onBlur={releaseFocus}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPressIn={() => {
            holdFocus.current = true;
          }}
          onPress={() => void send()}
          disabled={sending || !draft.trim()}
        >
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ChatDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    maxWidth: 220,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  statusText: {
    textAlign: "center",
    color: "#666",
    marginTop: 24,
  },
  message: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
  },
  messageGroupStart: {
    marginTop: 12,
  },
  messageGrouped: {
    marginTop: 2,
  },
  messageRight: {
    justifyContent: "flex-end",
  },
  messageLeft: {
    justifyContent: "flex-start",
  },
  avatarSlot: {
    width: 40,
    marginRight: 8,
  },
  bubbleColumn: {
    maxWidth: "80%",
    flexShrink: 1,
  },
  bubbleColumnMe: {
    alignItems: "flex-end",
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: "#ff7f50",
  },
  otherMessage: {
    backgroundColor: "#fff",
    borderColor: "#e5e5e5",
    borderWidth: 1,
  },
  senderName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ff7f50",
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
  },
  myContent: {
    color: "#fff",
  },
  otherContent: {
    color: "#333",
  },
  messageTimestamp: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  myTimestamp: {
    color: "#fff",
  },
  otherTimestamp: {
    color: "#666",
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
    height: 48,
  },
  sendButton: {
    backgroundColor: "#ff7f50",
    borderRadius: 24,
    padding: 12,
  },
});
