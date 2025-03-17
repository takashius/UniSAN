import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import CustomTheme from "../utils/CustomTheme";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ExplorerScreen from "../screens/ExplorerScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SANDetails from "../screens/SANDetails";
import EmailStepScreen from "../screens/auth/EmailStepScreen";
import VerificationStep from "../screens/auth/VerificationStep";
import { Home, MessageCircle, Search, Calendar, User } from "lucide-react-native";

// Tipos para las rutas
type SANStackParamList = {
  Explorar: undefined;
  Login: undefined;
  RecoveryPasswordStep1: undefined;
  RecoveryPasswordStep2: undefined;
  SANDetails: { id: string };
};

type TabParamList = {
  UNISAN: undefined;
  Chat: undefined;
  Explorar: undefined;
  Historial: undefined;
  Perfil: undefined;
};

const Stack = createStackNavigator<SANStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const AppNavigator: React.FC = () => {
  const user = false;

  const SANStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Explorar" component={ExplorerScreen} />
      <Stack.Screen name="SANDetails" component={SANDetails} />
    </Stack.Navigator>
  );

  return (
    <PaperProvider theme={CustomTheme}>
      <NavigationContainer>
        {user ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let IconComponent;

                switch (route.name) {
                  case "UNISAN":
                    IconComponent = Home;
                    break;
                  case "Chat":
                    IconComponent = MessageCircle;
                    break;
                  case "Explorar":
                    IconComponent = Search;
                    break;
                  case "Historial":
                    IconComponent = Calendar;
                    break;
                  case "Perfil":
                    IconComponent = User;
                    break;
                  default:
                    IconComponent = Home;
                }

                return <IconComponent color={color} size={size} />;
              },
              tabBarActiveTintColor: "#ff7f50",
              tabBarInactiveTintColor: "gray",
              tabBarStyle: {
                backgroundColor: "white",
                borderTopWidth: 1,
                borderTopColor: "#f4f4f4",
                height: 80,
                paddingTop: 12,
              },
              headerStyle: { backgroundColor: "#ff7f50" },
              headerTintColor: "white",
            })}
          >
            <Tab.Screen name="UNISAN" component={HomeScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Explorar" component={SANStack} />
            <Tab.Screen name="Historial" component={HistoryScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RecoveryPasswordStep1"
              component={EmailStepScreen}
              options={{
                headerTitle: "Recuperar contraseña",
                headerStyle: { backgroundColor: "#ff7f50" },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="RecoveryPasswordStep2"
              component={VerificationStep}
              options={{
                headerTitle: "Recuperar contraseña",
                headerStyle: { backgroundColor: "#ff7f50" },
                headerTintColor: "white",
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
