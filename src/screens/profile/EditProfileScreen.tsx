import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { Card, Dialog, Portal, IconButton, Button } from "react-native-paper";
import { Camera, Eye, EyeOff, Upload } from "lucide-react-native";
import generalStyles from "../../styles/general";
import { useUserProfile, useUploadImage, useUpdateUser } from "../../services/auth";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { Controller, useForm } from "react-hook-form";
import { ProfileFormData, ProfileUpdateData } from "../../types";
import { useQueryClient } from "@tanstack/react-query";

const EditProfile: React.FC = () => {
  const uploadMutation = useUploadImage();
  const updateMutation = useUpdateUser();
  const { data, isFetching } = useUserProfile();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loaderImage, setLoaderImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["uploadImage"] });

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      identityNumber: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (data) {
      setProfileImage(data.photo);
      setIdImage(data.imageDocumentId);
      reset({
        firstName: data.name ?? "",
        lastName: data.lastName ?? "",
        identityNumber: data.documentId ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
      });

    }
  }, [data, reset]);

  const onSubmit = (data: ProfileFormData) => {
    const payload: ProfileUpdateData = {
      name: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      documentId: data.identityNumber,
      password: data.password,
    };
    if (data.password === "") {
      delete payload.password;
    }
    updateMutation.mutate({ data: payload }, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: "Exito",
          text2: "Perfil actualizado correctamente"
        });
      },
      onError: (error) => {
        console.log("❌ Error al actualizar el usuario:", error);
        Toast.show({
          type: 'error',
          text1: "Error",
          text2: "Hubo un problema al actualizar. Intenta nuevamente"
        });
      },
    });
  };

  const handleImagePicker = async (imageType: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    setLoaderImage(imageType);

    if (!result.canceled) {
      const imageData = {
        image: {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "uploaded_image.jpg",
        },
        imageType,
      };


      uploadMutation.mutate(imageData, {
        onSuccess: (response) => {
          if (imageType === 'photo') {
            setProfileImage(response.data.path);
          } else {
            setIdImage(response.data.path);
          }
          Toast.show({
            type: 'success',
            text1: "Exito",
            text2: "Imagen subida correctamente"
          });
        },
        onError: (error) => {
          console.log("❌ Error al subir imagen:", error);
          Toast.show({
            type: 'error',
            text1: "Error",
            text2: "Hubo un problema al subir la imagen. Intenta nuevamente"
          });
        },
      });

    }
  };

  return (
    <View style={styles.container}>
      {isFetching && (
        <View style={generalStyles.loaderContainer}>
          <ActivityIndicator size="large" color="#ff4d4d" />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image */}
        <Card style={generalStyles.cardMin}>
          <Card.Content style={styles.centerContent}>
            <View style={styles.profileImageContainer}>
              {uploadMutation.isPending && loaderImage === 'photo' ? (
                <View style={styles.initials}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              ) : profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Text style={styles.initials}>MG</Text>
              )}
              <IconButton
                icon={({ size, color }) => <Camera size={size} color="#fff" />}
                size={20}
                style={styles.cameraIcon}
                onPress={() => handleImagePicker("photo")}
              />
            </View>
            <Text style={styles.helperText}>Toca para cambiar tu foto de perfil</Text>
          </Card.Content>
        </Card>

        {/* Personal Details */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <Text style={styles.label}>Nombre</Text>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "El nombre es obligatorio", minLength: { value: 2, message: "Debe tener al menos 2 caracteres" } }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={fieldState.error ? styles.inputError : styles.input}
                    onChangeText={field.onChange}
                    value={field.value}
                    placeholder="Ej. María"
                    autoCapitalize="words"
                  />
                  {fieldState.error && <Text style={generalStyles.errorText}>{fieldState.error.message}</Text>}
                </>
              )}
            />

            <Text style={styles.label}>Apellido</Text>
            <Controller
              name="lastName"
              control={control}
              rules={{ minLength: { value: 2, message: "Debe tener al menos 2 caracteres" } }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={fieldState.error ? styles.inputError : styles.input}
                    onChangeText={field.onChange}
                    value={field.value}
                    placeholder="Ej. González"
                    autoCapitalize="words"
                  />
                  {fieldState.error && <Text style={generalStyles.errorText}>{fieldState.error.message}</Text>}
                </>
              )}
            />

            <Text style={styles.label}>Número de Cédula</Text>
            <Controller
              name="identityNumber"
              control={control}
              rules={{ required: "La cédula es obligatoria", minLength: { value: 6, message: "Debe tener al menos 6 caracteres" } }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={fieldState.error ? styles.inputError : styles.input}
                    onChangeText={field.onChange}
                    value={field.value}
                    placeholder="Ej. 12345678"
                    inputMode="numeric"
                  />
                  {fieldState.error && <Text style={generalStyles.errorText}>{fieldState.error.message}</Text>}
                </>
              )}
            />

            <Text style={styles.label}>Télefono</Text>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={field.onChange}
                  value={field.value}
                  placeholder="4141234567"
                  inputMode="tel"
                />
              )}
            />

            <Text style={styles.label}>Correo</Text>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={field.onChange}
                  value={field.value}
                  placeholder="test@test.com"
                  editable={false}
                />
              )}
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
            <TouchableOpacity onPress={() => handleImagePicker("documentId")}>
              {uploadMutation.isPending && loaderImage === 'documentId' ? (
                <View style={styles.uploadContainer}>
                  <ActivityIndicator size="large" color="#ff7f50" />
                </View>
              ) : idImage ? (
                <Image source={{ uri: idImage }} style={styles.idImage} />
              ) : (
                <View style={styles.uploadContainer}>
                  <Upload size={36} color="#aaa" />
                  <Text style={styles.helperText}>
                    Haz clic para subir una foto de tu cédula
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Change Password */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <Controller
              name="password"
              control={control}
              rules={{
                minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
              }}
              render={({ field, fieldState }) => (
                <>
                  <Text style={styles.label}>Nueva Contraseña</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputPassword}
                      onChangeText={field.onChange}
                      value={field.value}
                      placeholder="********"
                      secureTextEntry={!passwordVisible} // 🔥 Alterna visibilidad
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? <EyeOff size={24} color="#aaa" /> : <Eye size={24} color="#aaa" />}
                    </TouchableOpacity>
                  </View>
                  {fieldState.error && <Text style={generalStyles.errorText}>{fieldState.error.message}</Text>}
                </>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                validate: (value) => value === watch("password") || "Las contraseñas no coinciden",
              }}
              render={({ field, fieldState }) => (
                <>
                  <Text style={styles.label}>Confirmar Contraseña</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputPassword}
                      onChangeText={field.onChange}
                      value={field.value}
                      placeholder="********"
                      secureTextEntry={!confirmPasswordVisible} // 🔥 Alterna visibilidad
                    />
                    <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                      {confirmPasswordVisible ? <EyeOff size={24} color="#aaa" /> : <Eye size={24} color="#aaa" />}
                    </TouchableOpacity>
                  </View>
                  {fieldState.error && <Text style={generalStyles.errorText}>{fieldState.error.message}</Text>}
                </>
              )}
            />
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
          loading={updateMutation.isPending}
        >
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
    justifyContent: "center", // 🔥 Centra verticalmente
    alignItems: "center", // 🔥 Centra horizontalmente
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    backgroundColor: "#ff7f50",
    borderWidth: 2, // Agrega un borde blanco
    borderColor: "#fff",
    borderRadius: 20, // Hace que el borde sea más visible y circular
    padding: 4, // Añade espacio interno para mejor diseño
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
  inputError: {
    borderWidth: 1,
    borderColor: "#ff4d4d",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 10
  }
});