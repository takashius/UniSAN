import { StyleSheet } from 'react-native';
import { I18nextProvider } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';
import { QueryClient } from "@tanstack/react-query";
import i18n from "./src/locales/i18n";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <I18nextProvider i18n={i18n}>
          <UserProvider>
            <StatusBar style="light" translucent={true} backgroundColor="transparent" />
            <AppNavigator />
          </UserProvider>
        </I18nextProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
