import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TextInput, ScrollView, ActivityIndicator, TouchableOpacity, Pressable } from "react-native";
import { Card, Portal, IconButton, Button } from "react-native-paper";
import { Camera, Eye, EyeOff, Upload } from "lucide-react-native";
import generalStyles from "../../styles/general";
import { useUserProfile, useUploadImage, useUpdateUser } from "../../services/auth";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { Controller, useForm } from "react-hook-form";
import { ProfileFormData, ProfileUpdateData } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ACCOUNT_QUERY_KEY, fetchAccount } from "../../services/auth";
import { useUser } from "../../context/UserContext";
import FullScreenLoader from "../../components/ui/FullScreenLoader";

function getUploadedImagePath(response: any): string | null {
  const payload = response?.data ?? response;
  const path = payload?.path || payload?.secure_url || payload?.url;
  return typeof path === "string" && path.trim() ? path : null;
}

const EditProfile: React.FC = () => {
  const { t } = useTranslation();
  const { setUser } = useUser();
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

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      identityNumber: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!data) return;
    setProfileImage((current) => data.photo || current);
    setIdImage((current) => data.imageDocumentId || current);
    reset({
      firstName: data.name ?? "",
      middleName: data.middleName ?? "",
      lastName: data.lastName ?? "",
      identityNumber: data.documentId ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
    });
  }, [data, reset]);

  const onSubmit = (data: ProfileFormData) => {
    const payload: ProfileUpdateData = {
      name: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      phone: data.phone,
      documentId: data.identityNumber,
      password: data.password,
    };
    if (data.password === "") {
      delete payload.password;
    }
    updateMutation.mutate({ data: payload }, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
        await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        try {
          setUser(await fetchAccount());
        } catch (error) {
          console.log(error);
        }
        Toast.show({
          type: 'success',
          text1: t("ProfileEdit.saveSuccessTitle"),
          text2: t("ProfileEdit.saveSuccessMessage")
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
    if (!result.canceled) {
      setLoaderImage(imageType);
      const localUri = result.assets[0].uri;
      if (imageType === "photo") {
        setProfileImage(localUri);
      } else {
        setIdImage(localUri);
      }

      const imageData = {
        image: {
          uri: localUri,
          type: "image/jpeg",
          name: "uploaded_image.jpg",
        },
        imageType,
      };

      uploadMutation.mutate(imageData, {
        onSuccess: async (response) => {
          const uploadedPath = getUploadedImagePath(response);
          if (uploadedPath) {
            if (imageType === "photo") {
              setProfileImage(uploadedPath);
            } else {
              setIdImage(uploadedPath);
            }
          }
          await queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
          await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          try {
            setUser(await fetchAccount());
          } catch (error) {
            console.log(error);
          }
          Toast.show({
            type: 'success',
            text1: t("ProfileEdit.uploadSuccessTitle"),
            text2: t("ProfileEdit.uploadSuccessMessage")
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
        onSettled: () => {
          setLoaderImage(null);
        },
      });

    }
  };

  return (
    <View style={styles.container}>
      <FullScreenLoader visible={isFetching || updateMutation.isPending} />
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
                <Text style={styles.initials}>
                  {(data?.name || "?").slice(0, 1).toUpperCase()}
                  {(data?.lastName || "").slice(0, 1).toUpperCase()}
                </Text>
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
            <Text style={styles.label}>{t("ProfileEdit.firstName")}</Text>
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

            <Text style={styles.label}>{t("ProfileEdit.middleName")}</Text>
            <Controller
              name="middleName"
              control={control}
              rules={{ required: t("ProfileEdit.middleNameRequired"), minLength: { value: 2, message: t("ProfileEdit.minTwo") } }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={fieldState.error ? styles.inputError : styles.input}
                    onChangeText={field.onChange}
                    value={field.value}
                    placeholder={t("ProfileEdit.middleNamePlaceholder")}
                    autoCapitalize="words"
                  />
                  {fieldState.error && <Text style={generalStyles.errorText}>{fieldState.error.message}</Text>}
                </>
              )}
            />

            <Text style={styles.label}>{t("ProfileEdit.lastName")}</Text>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: t("ProfileEdit.lastNameRequired"), minLength: { value: 2, message: t("ProfileEdit.minTwo") } }}
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

            <Text style={styles.label}>{t("ProfileEdit.phone")}</Text>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: t("ProfileEdit.phoneRequired"),
                validate: (value) =>
                  String(value || "").replace(/\D/g, "").length >= 10 || t("ProfileEdit.phoneInvalid"),
              }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={fieldState.error ? styles.inputError : styles.input}
                    onChangeText={field.onChange}
                    value={field.value}
                    placeholder="4141234567"
                    inputMode="tel"
                  />
                  {fieldState.error && <Text style={generalStyles.errorText}>{fieldState.error.message}</Text>}
                </>
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
              <Text style={styles.label}>{t("ProfileEdit.idPhoto")}</Text>
              <TouchableOpacity onPress={() => setShowDialog(true)} hitSlop={8}>
                <Text style={styles.whyLink}>{t("ProfileEdit.whyNeeded")}</Text>
              </TouchableOpacity>
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
          disabled={updateMutation.isPending}
        >
          Guardar Cambios
        </Button>
      </ScrollView>

      {showDialog ? (
        <Portal>
          <View style={styles.overlayRoot}>
            <Pressable style={styles.backdrop} onPress={() => setShowDialog(false)} />
            <View style={styles.dialogCenter} pointerEvents="box-none">
              <View style={styles.dialogCard}>
                <Text style={styles.dialogTitle}>{t("ProfileEdit.whyTitle")}</Text>
                <Text style={styles.dialogText}>{t("ProfileEdit.whyBody")}</Text>
                <Button
                  mode="contained"
                  style={styles.dialogButton}
                  onPress={() => setShowDialog(false)}
                >
                  {t("ProfileEdit.whyDismiss")}
                </Button>
              </View>
            </View>
          </View>
        </Portal>
      ) : null}
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
  whyLink: {
    color: "#ff7f50",
    fontSize: 13,
    fontWeight: "600",
  },
  overlayRoot: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  dialogCenter: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  dialogCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  dialogText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    marginBottom: 16,
  },
  dialogButton: {
    backgroundColor: "#ff7f50",
    alignSelf: "flex-end",
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