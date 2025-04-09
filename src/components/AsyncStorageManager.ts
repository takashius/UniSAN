import * as SecureStore from "expo-secure-store";

// Definición de tipos
type SecureStoreKey = "Token" | "contentType" | "responseType" | "User"; // Claves permitidas

class SecureStoreManager {
  /**
   * Guarda un valor en SecureStore
   * @param key - Clave para almacenar el dato
   * @param value - Valor que se desea almacenar
   */
  static async setItem<T>(key: SecureStoreKey, value: T): Promise<void> {
    try {
      const valueString = JSON.stringify(value); // Convertir a string
      await SecureStore.setItemAsync(key, valueString);
    } catch (error) {
      console.error(`Error saving ${key} to SecureStore:`, error);
    }
  }

  /**
   * Obtiene un valor almacenado en SecureStore
   * @param key - Clave del dato almacenado
   * @returns El valor almacenado o `null` si no existe
   */
  static async getItem<T>(key: SecureStoreKey): Promise<T | null> {
    try {
      const valueString = await SecureStore.getItemAsync(key);
      return valueString ? JSON.parse(valueString) : null; // Convertir de string a JSON
    } catch (error) {
      console.error(`Error retrieving ${key} from SecureStore:`, error);
      return null;
    }
  }

  /**
   * Elimina un valor almacenado en SecureStore
   * @param key - Clave del dato que se desea eliminar
   */
  static async removeItem(key: SecureStoreKey): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing ${key} from SecureStore:`, error);
    }
  }
}

export default SecureStoreManager;
