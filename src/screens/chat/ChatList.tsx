import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import type { ChatStackParamList } from "../../types/navigation";
import generalStyles from "../../styles/general";
import { useChatRooms } from "../../services/chat";
import FullScreenLoader from "../../components/ui/FullScreenLoader";

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { day: "2-digit", month: "short" });
}

const ChatList: React.FC = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const { data: chats, isLoading, isError, refetch } = useChatRooms();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenLoader visible={isLoading && !refreshing} />
      <ScrollView
        style={styles.chatList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
            colors={["#ff7f50"]}
            tintColor="#ff7f50"
          />
        }
      >
        {isError ? (
          <View style={styles.noChats}>
            <Text style={styles.noChatsText}>{t("Chat.loadError")}</Text>
          </View>
        ) : chats && chats.length > 0 ? (
          chats.map((chat, index) => (
            <Animated.View
              key={chat.id}
              entering={FadeIn.delay(index * 100).duration(400)}
              style={[generalStyles.card, { marginBottom: 12 }]}
            >
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() =>
                  navigation.navigate("ChatDetail", { id: chat.id })
                }
              >
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.sanName}</Text>
                  {chat.lastMessage?.sentAt ? (
                    <Text style={styles.chatTimestamp}>
                      {formatTimestamp(chat.lastMessage.sentAt)}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {chat.lastMessage
                    ? `${chat.lastMessage.authorName ? `${chat.lastMessage.authorName}: ` : ""}${chat.lastMessage.text}`
                    : t("Chat.noMessages")}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : !isLoading ? (
          <View style={styles.noChats}>
            <Text style={styles.noChatsText}>{t("Chat.empty")}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  chatList: {
    flex: 1,
    padding: 16,
  },
  chatButton: {
    width: "100%",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  chatTimestamp: {
    fontSize: 12,
    color: "#888",
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
  },
  noChats: {
    alignItems: "center",
    paddingVertical: 24,
  },
  noChatsText: {
    fontSize: 14,
    color: "#666",
  },
});
