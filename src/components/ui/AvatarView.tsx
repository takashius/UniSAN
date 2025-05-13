import { View, StyleSheet, Image, Text } from 'react-native'
import React from 'react'
import { Account } from '../../types';

const AvatarView = ({ user }: { user: Account }) => {
  const getInitials = (name: string, lastName?: string) => {
    if (!name) return "??";

    const nameParts = name.trim().split(" ");
    if (!lastName) {
      return nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : `${nameParts[0][0]}${nameParts[0][1]}`;
    }

    return `${name[0]}${lastName[0]}`;
  };

  return (
    <View style={styles.profileRow}>
      {user?.user.photo ? (
        <Image source={{ uri: user.user.photo }} style={styles.profileImage} />
      ) : (
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>{getInitials(user?.user.name, user?.user.lastName)}</Text>
        </View>
      )}
    </View>

  )
}

export default AvatarView

const styles = StyleSheet.create({
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  initialsContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffe4cf",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff7f50",
  },
});