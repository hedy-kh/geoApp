import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/AuthContext";
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!loading && !user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "RoleSelection" }],
      });
    } else if (!loading && user && requiredRole && user.role !== requiredRole) {
      Alert.alert("غير مصرح", "ليس لديك صلاحية للوصول إلى هذه الصفحة", [
        { text: "حسناً", onPress: () => navigation.goBack() },
      ]);
    }
  }, [user, loading, requiredRole]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return children;
};
