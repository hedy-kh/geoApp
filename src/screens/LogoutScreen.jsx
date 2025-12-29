import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../hooks/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
const LogoutScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد من تسجيل الخروج؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تسجيل الخروج",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={30} color="#FFFFFF" />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    container: {
        flex:1
    },
    title:{fontSize:20}
})

export default LogoutScreen;