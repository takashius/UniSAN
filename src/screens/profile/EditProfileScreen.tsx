import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  AppState,
} from "react-native";
import { Card, Portal, IconButton, Button } from "react-native-paper";
import {
  Camera,
  CircleCheck,
  Eye,
  EyeOff,
  Hourglass,
  Upload,
} from "lucide-react-native";
import generalStyles from "../../styles/general";
import {
  ACCOUNT_QUERY_KEY,
  USER_PROFILE_QUERY_KEY,
  fetchAccount,
  useUserProfile,
  useUploadImage,
  useUpdateUser,
} from "../../services/auth";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { Controller, useForm } from "react-hook-form";
import {
  DocumentIdStatus,
  ProfileFormData,
  ProfileUpdateData,
} from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import ImageSourceSheet from "../../components/ui/ImageSourceSheet";

function getUploadedImagePath(response: unknown): string | null {
  const payload =
    response && typeof response === "object" && "data" in response
      ? (response as { data?: unknown }).data
      : response;
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const path = record.path || record.secure_url || record.url;
  return typeof path === "string" && path.trim() ? path : null;
}

const EditProfile: React.FC = () => {
  const { t } = useTranslation();
  const { setUser } = useUser();
  const uploadMutation = useUploadImage();
  const updateMutation = useUpdateUser();
  const { data, isFetching, refetch } = useUserProfile();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loaderImage, setLoaderImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [documentStatus, setDocumentStatus] =
    useState<DocumentIdStatus>("none");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [imageSourceType, setImageSourceType] = useState<string | null>(null);
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

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void refetch();
      }
    });
    return () => sub.remove();
  }, [refetch]);

  useEffect(() => {
    if (!data) return;
    setProfileImage((current) => data.photo || current);
    setDocumentStatus(data.imageDocumentIdStatus || "none");
    setRejectionReason(data.imageDocumentIdRejectionReason || "");
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
    updateMutation.mutate(
      { data: payload },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
          await queryClient.invalidateQueries({
            queryKey: USER_PROFILE_QUERY_KEY,
          });
          try {
            setUser(await fetchAccount());
          } catch (error) {
            console.warn(error);
          }
          Toast.show({
            type: "success",
            text1: t("ProfileEdit.saveSuccessTitle"),
            text2: t("ProfileEdit.saveSuccessMessage"),
          });
        },
        onError: (error) => {
          console.warn("Error al actualizar el usuario:", error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Hubo un problema al actualizar. Intenta nuevamente",
          });
        },
      },
    );
  };

  const handleImagePicker = async (
    imageType: string,
    source: "camera" | "library",
  ) => {
    setImageSourceType(null);
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: t(
          source === "camera"
            ? "ProfileEdit.cameraPermissionDenied"
            : "ProfileEdit.libraryPermissionDenied",
        ),
      });
      return;
    }

    const pickerOptions = {
      mediaTypes: ["images"] as const,
      allowsEditing: true,
      quality: 0.6,
    };
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(pickerOptions)
        : await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (!result.canceled) {
      setLoaderImage(imageType);
      const localUri = result.assets[0].uri;
      if (imageType === "photo") {
        setProfileImage(localUri);
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
          if (uploadedPath && imageType === "photo") {
            setProfileImage(uploadedPath);
          }
          if (imageType === "documentId") {
            setDocumentStatus("pending");
            setRejectionReason("");
          }
          await queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
          await queryClient.invalidateQueries({
            queryKey: USER_PROFILE_QUERY_KEY,
          });
          try {
            setUser(await fetchAccount());
          } catch (error) {
            console.warn(error);
          }
          Toast.show({
            type: "success",
            text1: t("ProfileEdit.uploadSuccessTitle"),
            text2: t("ProfileEdit.uploadSuccessMessage"),
          });
        },
        onError: (error) => {
          console.warn("Error al subir imagen:", error);
          const message =
            error && typeof error === "object" && "message" in error
              ? String((error as { message?: unknown }).message || "")
              : "";
          const tooLarge = /too large|413|demasiado grande/i.test(message);
          Toast.show({
            type: "error",
            text1: t("common.error"),
            text2: t(
              tooLarge ? "ProfileEdit.uploadTooLarge" : "ProfileEdit.uploadError"
            ),
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
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => setImageSourceType("photo")}
              activeOpacity={0.85}
            >
              {uploadMutation.isPending && loaderImage === "photo" ? (
                <View style={styles.initials}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              ) : profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Text style={styles.initials}>
                  {(data?.name || "?").slice(0, 1).toUpperCase()}
                  {(data?.lastName || "").slice(0, 1).toUpperCase()}
                </Text>
              )}
              <IconButton
                icon={({ size }) => <Camera size={size} color="#fff" />}
                size={20}
                style={styles.cameraIcon}
                onPress={() => setImageSourceType("photo")}
              />
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Toca para cambiar tu foto de perfil
            </Text>
          </Card.Content>
        </Card>

        {/* Personal Details */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <Text style={styles.label}>{t("ProfileEdit.firstName")}</Text>
            <Controller
              name="firstName"
              control={control}
              rules={{
                required: "El nombre es obligatorio",
                minLength: {
                  value: 2,
                  message: "Debe tener al menos 2 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={fieldState.error ? styles.inputError : styles.input}
                    onChangeText={field.onChange}
                    value={field.value}
                    placeholder="Ej. María"
                    autoCapitalize="words"
                  />
                  {fieldState.error && (
                    <Text style={generalStyles.errorText}>
                      {fieldState.error.message}
                    </Text>
                  )}
                </>
              )}
            />

            <Text style={styles.label}>{t("ProfileEdit.middleName")}</Text>
            <Controller
              name="middleName"
              control={control}
              rules={{
                required: t("ProfileEdit.middleNameRequired"),
                minLength: { value: 2, message: t("ProfileEdit.minTwo") },
              }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={fieldState.error ? styles.inputError : styles.input}
                    onChangeText={field.onChange}
                    value={field.value}
                    placeholder={t("ProfileEdit.middleNamePlaceholder")}
                    autoCapitalize="words"
                  />
                  {fieldState.error && (
                    <Text style={generalStyles.errorText}>
                      {fieldState.error.message}
                    </Text>
                  )}
                </>
              )}
            />

            <Text style={styles.label}>{t("ProfileEdit.lastName")}</Text>
            <Controller
              name="lastName"
              control={control}
              rules={{
                required: t("ProfileEdit.lastNameRequired"),
                minLength: { value: 2, message: t("ProfileEdit.minTwo") },
              }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={fieldState.error ? styles.inputError : styles.input}
                    onChangeText={field.onChange}
                    value={field.value}
                    placeholder="Ej. González"
                    autoCapitalize="words"
                  />
                  {fieldState.error && (
                    <Text style={generalStyles.errorText}>
                      {fieldState.error.message}
                    </Text>
                  )}
                </>
              )}
            />

            <Text style={styles.label}>Número de Cédula</Text>
            <Controller
              name="identityNumber"
              control={control}
              rules={{
                required: "La cédula es obligatoria",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={fieldState.error ? styles.inputError : styles.input}
                    onChangeText={field.onChange}
                    value={field.value}
                    placeholder="Ej. 12345678"
                    inputMode="numeric"
                  />
                  {fieldState.error && (
                    <Text style={generalStyles.errorText}>
                      {fieldState.error.message}
                    </Text>
                  )}
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
                  String(value || "").replace(/\D/g, "").length >= 10 ||
                  t("ProfileEdit.phoneInvalid"),
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
                  {fieldState.error && (
                    <Text style={generalStyles.errorText}>
                      {fieldState.error.message}
                    </Text>
                  )}
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
            {documentStatus === "pending" ? (
              <View style={styles.statusBox}>
                <Hourglass size={36} color="#ff7f50" />
                <Text style={styles.statusTitle}>
                  {t("ProfileEdit.idPendingTitle")}
                </Text>
                <Text style={styles.helperText}>
                  {t("ProfileEdit.idPendingMessage")}
                </Text>
              </View>
            ) : documentStatus === "approved" ? (
              <View style={styles.statusBox}>
                <CircleCheck size={36} color="#16a34a" />
                <Text style={styles.statusTitle}>
                  {t("ProfileEdit.idApprovedTitle")}
                </Text>
                <Text style={styles.helperText}>
                  {t("ProfileEdit.idApprovedMessage")}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setImageSourceType("documentId")}
              >
                {uploadMutation.isPending && loaderImage === "documentId" ? (
                  <View style={styles.uploadContainer}>
                    <ActivityIndicator size="large" color="#ff7f50" />
                  </View>
                ) : (
                  <View style={styles.uploadContainer}>
                    <Upload size={36} color="#aaa" />
                    <Text style={styles.helperText}>
                      {documentStatus === "rejected"
                        ? t("ProfileEdit.idRejectedMessage")
                        : t("ProfileEdit.idUploadHint")}
                    </Text>
                    {documentStatus === "rejected" && rejectionReason ? (
                      <Text style={styles.rejectedReason}>
                        {rejectionReason}
                      </Text>
                    ) : null}
                  </View>
                )}
              </TouchableOpacity>
            )}
          </Card.Content>
        </Card>

        {/* Change Password */}
        <Card style={generalStyles.cardMin}>
          <Card.Content>
            <Controller
              name="password"
              control={control}
              rules={{
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
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
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <EyeOff size={24} color="#aaa" />
                      ) : (
                        <Eye size={24} color="#aaa" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {fieldState.error && (
                    <Text style={generalStyles.errorText}>
                      {fieldState.error.message}
                    </Text>
                  )}
                </>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
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
                    <TouchableOpacity
                      onPress={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                    >
                      {confirmPasswordVisible ? (
                        <EyeOff size={24} color="#aaa" />
                      ) : (
                        <Eye size={24} color="#aaa" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {fieldState.error && (
                    <Text style={generalStyles.errorText}>
                      {fieldState.error.message}
                    </Text>
                  )}
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

      <ImageSourceSheet
        visible={Boolean(imageSourceType)}
        onDismiss={() => setImageSourceType(null)}
        onCamera={() => {
          if (imageSourceType)
            void handleImagePicker(imageSourceType, "camera");
        }}
        onLibrary={() => {
          if (imageSourceType)
            void handleImagePicker(imageSourceType, "library");
        }}
      />

      {showDialog ? (
        <Portal>
          <View style={styles.overlayRoot}>
            <Pressable
              style={styles.backdrop}
              onPress={() => setShowDialog(false)}
            />
            <View style={styles.dialogCenter} pointerEvents="box-none">
              <View style={styles.dialogCard}>
                <Text style={styles.dialogTitle}>
                  {t("ProfileEdit.whyTitle")}
                </Text>
                <Text style={styles.dialogText}>
                  {t("ProfileEdit.whyBody")}
                </Text>
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
  statusBox: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 20,
    marginTop: 8,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  rejectedReason: {
    fontSize: 12,
    color: "#ff4d4d",
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
    paddingVertical: 10,
  },
});
