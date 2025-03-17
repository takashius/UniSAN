import { DefaultTheme } from "react-native-paper";

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1E88E5", // Azul
    accent: "#42A5F5", // Azul más claro
    background: "#E3F2FD", // Azul muy claro para el fondo
    surface: "#FFFFFF", // Blanco para la superficie
    error: "#B00020", // Rojo para los errores
    onBackground: "#0D47A1", // Azul oscuro para el texto sobre el fondo
    onSurface: "#0D47A1", // Azul oscuro para el texto sobre la superficie
    disabled: "#BBDEFB", // Azul claro para elementos desactivados
    placeholder: "#90CAF9", // Azul medio para los placeholders
    backdrop: "#1565C0", // Azul oscuro para el backdrop
    notification: "#1976D2", // Azul para notificaciones
  },
};

export default CustomTheme;
