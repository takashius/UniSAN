import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Send, Search } from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeIn,
} from "react-native-reanimated";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

const ChatScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Mock data (similar a lo original)
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

  const messages: Message[] = [
    {
      id: "1",
      sender: "Juan Pérez",
      content: "Hola a todos, ¿cómo están?",
      timestamp: "10:30",
      isMe: false,
    },
    {
      id: "2",
      sender: "Ana López",
      content: "Todo bien por aquí, gracias",
      timestamp: "10:32",
      isMe: false,
    },
    {
      id: "3",
      sender: "Tú",
      content: "Hola a todos, quería recordarles que el próximo pago es el viernes",
      timestamp: "10:35",
      isMe: true,
    },
    {
      id: "4",
      sender: "Roberto Silva",
      content: "Gracias por el recordatorio",
      timestamp: "10:36",
      isMe: false,
    },
    {
      id: "5",
      sender: "Juan Pérez",
      content: "¿Alguien sabe si podemos adelantar los pagos?",
      timestamp: "10:38",
      isMe: false,
    },
  ];

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeChat) {
    const chat = chats.find((c) => c.id === activeChat);

    return (
      <View style={styles.container}>

        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <TouchableOpacity
            onPress={() => setActiveChat(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Volver a chats</Text>
          </TouchableOpacity>

          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={FadeInDown.delay(index * 50).duration(300)}
              style={[
                styles.message,
                message.isMe ? styles.messageRight : styles.messageLeft,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isMe ? styles.myMessage : styles.otherMessage,
                ]}
              >
                {!message.isMe && (
                  <Text style={styles.senderName}>{message.sender}</Text>
                )}
                <Text style={styles.messageContent}>{message.content}</Text>
                <Text
                  style={[
                    styles.messageTimestamp,
                    message.isMe ? styles.myTimestamp : styles.otherTimestamp,
                  ]}
                >
                  {message.timestamp}
                </Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
          />
          <TouchableOpacity style={styles.sendButton}>
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <ScrollView style={styles.chatList}>
        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => (
            <Animated.View
              key={chat.id}
              entering={FadeIn.delay(index * 100).duration(400)}
              style={styles.chatCard}
            >
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => setActiveChat(chat.id)}
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

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#ff7f50",
    fontSize: 14,
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
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#ff7f50",
    borderRadius: 24,
    padding: 12,
  },
  chatList: {
    flex: 1,
    padding: 16,
  },
  chatCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
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
