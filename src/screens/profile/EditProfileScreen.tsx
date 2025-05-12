import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TextInput, ScrollView } from "react-native";
import { Appbar, Button, Card, Dialog, Portal, IconButton, Switch } from "react-native-paper";
import { Camera, Upload } from "lucide-react-native";
import generalStyles from "../../styles/general";

const EditProfile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("María");
  const [lastName, setLastName] = useState("González");
  const [identityNumber, setIdentityNumber] = useState("V-12345678");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const handleProfileImageChange = (file: string) => {
    setProfileImage(file);
  };

  const handleIdImageChange = (file: string) => {
    setIdImage(file);
  };

  const handleSubmit = () => {
    if (password && password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    alert("Perfil actualizado exitosamente.");
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image */}
        <Card style={generalStyles.cardMin}>
          <Card.Content style={styles.centerContent}>
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Text style={styles.initials}>MG</Text>
              )}
              <IconButton
                icon={({ size, color }) => <Camera size={size} color={color} />}
                size={20}
                style={styles.cameraIcon}
                onPress={() => console.log("Open camera to change profile image")}
              />
            </View>
            <Text style={styles.helperText}>Toca para cambiar tu foto de perfil</Text>
          </Card.Content>
        </Card>

        {/* Personal Details */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ej. María"
            />
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Ej. González"
            />
            <Text style={styles.label}>Número de Cédula</Text>
            <TextInput
              style={styles.input}
              value={identityNumber}
              onChangeText={setIdentityNumber}
              placeholder="Ej. V-12345678"
            />
          </Card.Content>
        </Card>

        {/* ID Image */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <View style={styles.row}>
              <Text style={styles.label}>Foto de Cédula</Text>
              <Button onPress={() => setShowDialog(true)}>¿Por qué necesitamos esto?</Button>
            </View>
            {idImage ? (
              <Image source={{ uri: idImage }} style={styles.idImage} />
            ) : (
              <View style={styles.uploadContainer}>
                <Upload size={36} color="#aaa" />
                <Text style={styles.helperText}>
                  Arrastra y suelta o haz clic para subir una foto de tu cédula
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Change Password */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
            <Text style={styles.helperText}>
              Deja los campos en blanco si no deseas cambiar tu contraseña.
            </Text>
            <Text style={styles.label}>Nueva Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry
            />
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="********"
              secureTextEntry
            />
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button mode="contained" style={styles.saveButton} onPress={handleSubmit}>
          Guardar Cambios
        </Button>
      </ScrollView>

      {/* Dialog */}
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Verificación de Identidad</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Necesitamos una foto de tu cédula para verificar tu identidad y cumplir con
              nuestras políticas de seguridad. Esta información es confidencial y solo se
              utilizará para fines de verificación.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Entendido</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContent: {
    padding: 16,
  },
  centerContent: {
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    alignItems: "center",
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  initials: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#ff7f50",
    color: "#fff",
    textAlign: "center",
    lineHeight: 96,
    fontSize: 24,
    fontWeight: "bold",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    backgroundColor: "#ff7f50",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  idImage: {
    width: "100%",
    height: 200,
    marginTop: 16,
    borderRadius: 8,
  },
  uploadContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#ff7f50",
  },
  dialogText: {
    fontSize: 14,
    color: "#666",
  },
});