import React from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { Send } from "lucide-react-native";
import { FadeInDown } from "react-native-reanimated";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

const ChatDetail: React.FC = () => {

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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingBottom: 80 }}
      >

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
              {!message.isMe && <Text style={styles.senderName}>{message.sender}</Text>}
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
        <TextInput style={styles.input} placeholder="Escribe un mensaje..." />
        <TouchableOpacity style={styles.sendButton}>
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatDetail;

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