import { View, StyleSheet, Image, Text } from 'react-native'
import React from 'react'
import { Account } from '../../types';

interface Avatar {
  name: string;
  lastName?: string;
  photo?: string;
  mini?: boolean
}

const AvatarView: React.FC<Avatar> = ({ name, lastName, photo, mini = false }) => {
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
      {photo ? (
        <Image source={{ uri: photo }} style={[mini ? styles.profileImage : styles.profileImageMini]} />
      ) : (
        <View style={[styles.initialsContainer, mini ? styles.profileImage : styles.profileImageMini]}>
          <Text style={[styles.initialsText, mini ? styles.font : styles.fontMini]}>{getInitials(name, lastName)}</Text>
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
  profileImageMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  initialsContainer: {
    backgroundColor: "#ffe4cf",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontWeight: "bold",
    color: "#ff7f50",
  },
  font: {
    fontSize: 24,
  },
  fontMini: {
    fontSize: 18,
  }
});