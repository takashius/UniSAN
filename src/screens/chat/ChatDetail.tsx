import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Bell, BellOff, ChevronLeft, Send } from "lucide-react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
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
import FullScreenLoader from "../../components/ui/FullScreenLoader";

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

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages?.length]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await connectChatSocket();
      const response = await emitChatMessage(id, text);
      if (response.error) {
        Toast.show({ type: "error", text1: t("Chat.sendError") });
        return;
      }
      setDraft("");
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
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
          style={styles.headerSide}
          accessibilityLabel={t("Chat.back")}
        >
          <ChevronLeft size={22} color="#ff7f50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity
          style={styles.headerSide}
          accessibilityLabel={muted ? t("Chat.unmute") : t("Chat.mute")}
          onPress={() => muteRoom.mutate({ sanId: id, muted: !muted })}
        >
          {muted ? (
            <BellOff size={20} color="#888" />
          ) : (
            <Bell size={20} color="#ff7f50" />
          )}
        </TouchableOpacity>
      </View>

      <FullScreenLoader visible={isLoading} />

      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingBottom: 16 }}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
      >
        {isError ? (
          <Text style={styles.statusText}>{t("Chat.unavailable")}</Text>
        ) : messages && messages.length === 0 ? (
          <Text style={styles.statusText}>{t("Chat.noMessages")}</Text>
        ) : (
          (messages || []).map((message, index) => {
            const isMe = String(message.user.id) === String(myId);
            const sender = `${message.user.name || ""} ${message.user.lastName || ""}`.trim();
            return (
              <Animated.View
                key={message.id}
                entering={FadeInDown.delay(Math.min(index, 8) * 30).duration(300)}
                style={[
                  styles.message,
                  isMe ? styles.messageRight : styles.messageLeft,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.myMessage : styles.otherMessage,
                  ]}
                >
                  {!isMe && sender ? (
                    <Text style={styles.senderName}>{sender}</Text>
                  ) : null}
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
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("Chat.placeholder")}
          value={draft}
          onChangeText={setDraft}
          editable={!sending}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => void send()}
          disabled={sending || !draft.trim()}
        >
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerSide: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusText: {
    textAlign: "center",
    color: "#666",
    marginTop: 24,
  },
  message: {
    marginVertical: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
  },
  messageRight: {
    alignSelf: "flex-end",
  },
  messageLeft: {
    alignSelf: "flex-start",
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
    fontSize: 12,
    color: "#666",
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
