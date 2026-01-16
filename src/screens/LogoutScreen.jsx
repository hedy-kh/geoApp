import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../hooks/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const LogoutScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogout = () => {
    animatePress();

    Alert.alert(
      "تسجيل الخروج",
      "هل أنت متأكد من رغبتك في تسجيل الخروج؟",
      [
        {
          text: "البقاء",
          style: "cancel",
          onPress: () => console.log("Logout cancelled"),
        },
        {
          text: "تسجيل الخروج",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              // Optional: Show success message or navigate
            } catch (error) {
              Alert.alert(
                "خطأ",
                "حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى."
              );
              console.error("Logout error:", error);
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* User Info Section */}
        {user && (
          <View style={styles.userInfoCard}>
            <View style={styles.avatarContainer}>
              <Icon name="account-circle" size={70} color="#4A90E2" />
            </View>
            <Text style={styles.userName}>
              {user.name || user.email || "مستخدم"}
            </Text>
            <Text style={styles.userEmail}>{user.email || ""}</Text>
          </View>
        )}

        {/* Warning/Info Section */}
        <View style={styles.warningCard}>
          <Icon name="information-outline" size={24} color="#FFA000" />
          <Text style={styles.warningText}>
            عند تسجيل الخروج، سيتم حذف البيانات المحلية المخزنة على جهازك
          </Text>
        </View>

        {/* Logout Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              isLoggingOut && styles.logoutButtonDisabled,
            ]}
            onPress={handleLogout}
            disabled={isLoggingOut}
            activeOpacity={0.8}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Icon name="logout" size={24} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>تسجيل الخروج</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

       
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  userInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    opacity: 0.8,
  },
  warningCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#FFECB3",
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#5D4037",
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: "#FF4444",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: width * 0.85,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonDisabled: {
    backgroundColor: "#FF8888",
    opacity: 0.8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 40,
  },
  optionButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    width: width * 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    color: "#444",
  },
});

export default LogoutScreen;
