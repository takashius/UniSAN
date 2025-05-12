import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { FadeIn } from "react-native-reanimated";
import { useNavigation } from '@react-navigation/native';
import generalStyles from "../../styles/general";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const ChatList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigation: any = useNavigation();
  const chats: Chat[] = [
    {
      id: "1",
      name: "SAN Básico",
      lastMessage: "Juan: Hola a todos, ¿cómo están?",
      timestamp: "10:30",
      unread: 2,
    },
    {
      id: "2",
      name: "SAN Quincenal",
      lastMessage: "María: El próximo pago es el viernes",
      timestamp: "Ayer",
      unread: 0,
    },
  ];

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatList}>
        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => (
            <Animated.View
              key={chat.id}
              entering={FadeIn.delay(index * 100).duration(400)}
              style={[generalStyles.card, { marginBottom: 12 }]}
            >
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate("ChatDetail", { params: { id: chat.id } })}
              >
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <View style={styles.chatInfo}>
                    <Text style={styles.chatTimestamp}>{chat.timestamp}</Text>
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : (
          <View style={styles.noChats}>
            <Text style={styles.noChatsText}>No se encontraron chats</Text>
          </View>
        )}
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
  },
  chatInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatTimestamp: {
    fontSize: 12,
    color: "#888",
  },
  unreadBadge: {
    backgroundColor: "#ff7f50",
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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