import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { AuthProvider, useAuth } from "./src/hooks/AuthContext";
import RoleSelectionScreen from "./src/screens/auth/RoleSelectionScreen";
import AuthSelectionScreen from "./src/screens/auth/AuthSelectionScreen";
import SignupScreen from "./src/screens/auth/SignupScreen";
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import AppNavigator from "./src/navigation/AppNavigator";

const Stack = createStackNavigator();

function MainStack() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={user ? "App" : "Onboarding"}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          <Stack.Screen name="AuthSelection" component={AuthSelectionScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </>
      ) : (
        <Stack.Screen name="App" component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
