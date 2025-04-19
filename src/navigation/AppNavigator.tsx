import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import CustomTheme from "../utils/CustomTheme";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatList from "../screens/chat/ChatList";
import ChatDetail from "../screens/chat/ChatDetail";
import HistoryScreen from "../screens/HistoryScreen";
import ExplorerScreen from "../screens/ExplorerScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SANDetails from "../screens/SANDetails";
import EmailStepScreen from "../screens/auth/EmailStepScreen";
import VerificationStep from "../screens/auth/VerificationStep";
import PreferencesScreen from "../screens/profile/PreferencesScreen";
import EditProfile from "../screens/profile/EditProfileScreen";
import PaymentMethods from "../screens/profile/PaymentMethodsScreen";
import { Home, MessageCircle, Search, Calendar, User } from "lucide-react-native";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";

type SANStackParamList = {
  Explorer: undefined;
  Login: undefined;
  RecoveryPasswordStep1: undefined;
  RecoveryPasswordStep2: undefined;
  SANDetails: { id: string };
};

type ChatStackParamList = {
  ChatList: any;
  ChatDetail: { id: string };
};

type ProfileStackParamList = {
  Profile: undefined;
  Preference: undefined;
  EditProfile: undefined;
  PaymentMethods: undefined;
};

type TabParamList = {
  UNISAN: undefined;
  Chat: undefined;
  Explorer: undefined;
  History: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<SANStackParamList>();
const Chat = createStackNavigator<ChatStackParamList>();
const Profile = createStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const AppNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  const SANStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Explorer" component={ExplorerScreen} />
      <Stack.Screen name="SANDetails" component={SANDetails} />
    </Stack.Navigator>
  );

  const ProfileStack = () => (
    <Profile.Navigator>
      <Profile.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: t("Navigation.profile"),
          headerStyle: { backgroundColor: "#ff7f50" },
          headerTintColor: "white",
        }}
      />
      <Profile.Screen
        name="Preference"
        component={PreferencesScreen}
        options={{
          headerTitle: t("Navigation.preferences"),
          headerStyle: { backgroundColor: "#ff7f50" },
          headerTintColor: "white",
        }}
      />
      <Profile.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: t("Navigation.editProfile"),
          headerStyle: { backgroundColor: "#ff7f50" },
          headerTintColor: "white",
        }}
      />
      <Profile.Screen
        name="PaymentMethods"
        component={PaymentMethods}
        options={{
          headerTitle: t("Navigation.paymentMethods"),
          headerStyle: { backgroundColor: "#ff7f50" },
          headerTintColor: "white",
        }}
      />
    </Profile.Navigator>
  );

  const ChatStack = () => (
    <Chat.Navigator screenOptions={{ headerShown: false }}>
      <Chat.Screen name="ChatList" component={ChatList} />
      <Chat.Screen name="ChatDetail" component={ChatDetail} />
    </Chat.Navigator>
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
                  case "Explorer":
                    IconComponent = Search;
                    break;
                  case "History":
                    IconComponent = Calendar;
                    break;
                  case "Profile":
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
            <Tab.Screen
              name="UNISAN"
              component={HomeScreen}
              options={{
                tabBarLabel: t("Navigation.home"),
                headerTitle: t("Navigation.home"),
              }} />
            <Tab.Screen
              name="Chat"
              component={ChatStack}
              options={{
                tabBarLabel: t("Navigation.chat")
              }} />
            <Tab.Screen
              name="Explorer"
              component={SANStack}
              options={{
                tabBarLabel: t("Navigation.explorer"),
                headerTitle: t("Navigation.explorer"),
              }} />
            <Tab.Screen
              name="History"
              component={HistoryScreen}
              options={{
                tabBarLabel: t("Navigation.history"),
                headerTitle: t("Navigation.history"),
              }} />
            <Tab.Screen
              name="Profile"
              component={ProfileStack}
              options={{
                headerShown: false
              }} />
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
                headerTitle: t("Navigation.recoverPassword"),
                headerStyle: { backgroundColor: "#ff7f50" },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="RecoveryPasswordStep2"
              component={VerificationStep}
              options={{
                headerTitle: t("Navigation.recoverPassword"),
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
