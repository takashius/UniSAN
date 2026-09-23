import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTheme from "../utils/CustomTheme";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatList from "../screens/chat/ChatList";
import ChatDetail from "../screens/chat/ChatDetail";
import HistoryScreen from "../screens/HistoryScreen";
import ExplorerScreen from "../screens/ExplorerScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import TermsScreen from "../screens/legal/TermsScreen";
import SANDetails from "../screens/SANDetails";
import EmailStepScreen from "../screens/auth/EmailStepScreen";
import VerificationStep from "../screens/auth/VerificationStep";
import PreferencesScreen from "../screens/profile/PreferencesScreen";
import EditProfile from "../screens/profile/EditProfileScreen";
import PaymentMethods from "../screens/profile/PaymentMethodsScreen";
import { Home, MessageCircle, Search, Calendar, User } from "lucide-react-native";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";
import { ChatStackParamList, ProfileStackParamList, SANStackParamList, AuthStackParamList, TabParamList } from "../types/navigation";
import { CHAT_ENABLED } from "../config/features";
import { registerAndSyncPushToken } from "../services/notifications";

const SanStack = createNativeStackNavigator<SANStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Chat = createNativeStackNavigator<ChatStackParamList>();
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const AppNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!user) return;
    void registerAndSyncPushToken();
  }, [user]);

  const SANStack = () => (
    <SanStack.Navigator screenOptions={{ headerShown: false }}>
      <SanStack.Screen name="ExplorerHome" component={ExplorerScreen} />
      <SanStack.Screen name="SANDetails" component={SANDetails} />
    </SanStack.Navigator>
  );

  const ProfileStack = () => (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{
          headerTitle: t("Navigation.profile"),
          headerStyle: { backgroundColor: "#ff7f50" },
          headerTintColor: "white",
        }}
      />
      <ProfileStackNav.Screen
        name="Preference"
        component={PreferencesScreen}
        options={{
          headerTitle: t("Navigation.preferences"),
          headerStyle: { backgroundColor: "#ff7f50" },
          headerTintColor: "white",
        }}
      />
      <ProfileStackNav.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: t("Navigation.editProfile"),
          headerStyle: { backgroundColor: "#ff7f50" },
          headerTintColor: "white",
        }}
      />
      <ProfileStackNav.Screen
        name="PaymentMethods"
        component={PaymentMethods}
        options={{
          headerTitle: t("Navigation.paymentMethods"),
          headerStyle: { backgroundColor: "#ff7f50" },
          headerTintColor: "white",
        }}
      />
      <ProfileStackNav.Screen
        name="Terms"
        component={TermsScreen}
        options={{
          headerTitle: t("Navigation.terms"),
          headerStyle: { backgroundColor: "#ff7f50" },
          headerTintColor: "white",
        }}
      />
    </ProfileStackNav.Navigator>
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
          user.needsTermsAcceptance ? (
            <TermsScreen mode="accept" />
          ) : (
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
                height: 56 + insets.bottom + 12,
                paddingTop: 12,
                paddingBottom: insets.bottom + 8,
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
            {CHAT_ENABLED ? (
              <Tab.Screen
                name="Chat"
                component={ChatStack}
                options={{
                  tabBarLabel: t("Navigation.chat")
                }} />
            ) : null}
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
                headerShown: false,
                tabBarLabel: t("Navigation.profile"),
              }} />
          </Tab.Navigator>
          )
        ) : (
          <AuthStack.Navigator>
            <AuthStack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <AuthStack.Screen
              name="RecoveryPasswordStep1"
              component={EmailStepScreen}
              options={{
                headerTitle: t("Navigation.recoverPassword"),
                headerStyle: { backgroundColor: "#ff7f50" },
                headerTintColor: "white",
              }}
            />
            <AuthStack.Screen
              name="RecoveryPasswordStep2"
              component={VerificationStep}
              options={{
                headerTitle: t("Navigation.recoverPassword"),
                headerStyle: { backgroundColor: "#ff7f50" },
                headerTintColor: "white",
              }}
            />
            <AuthStack.Screen
              name="Terms"
              component={TermsScreen}
              options={{
                headerTitle: t("Navigation.terms"),
                headerStyle: { backgroundColor: "#ff7f50" },
                headerTintColor: "white",
              }}
            />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
