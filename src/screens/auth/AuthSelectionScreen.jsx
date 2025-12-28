import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
const AuthSelectionScreen = ({ navigation, route }) => {
  const { role } = route.params;

  const getRoleTitle = () => {
    switch(role) {
      case 'student': return 'التلميذ';
      case 'teacher': return 'المعلم';
      case 'parent': return 'ولي الأمر';
      default: return 'المستخدم';
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login', { role });
  };

  const handleSignup = () => {
    navigation.navigate('Signup', { role });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon 
            name={
              role === 'student' ? 'school' : 
              role === 'teacher' ? 'account-tie' : 
              'account-group'
            } 
            size={80} 
            color="#4F46E5" 
          />
          <Text style={styles.welcomeText}>مرحباً بك في فضاء {getRoleTitle()}</Text>
          <Text style={styles.subtitle}>
            اختر طريقة الدخول للوصول إلى أدواتك التعليمية
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.authButton, styles.signupButton]}
            onPress={handleSignup}
          >
            <Icon name="account-plus" size={32} color="#FFFFFF" />
            <Text style={styles.authButtonText}>إنشاء حساب جديد</Text>
            <Text style={styles.authButtonSubtext}>
              {role === 'student' ? 'سجل الآن وابدأ رحلتك الجغرافية' :
               role === 'teacher' ? 'انضم كمعلم وأدير فصلك الدراسي' :
               'تابع مستوى أبنائك وتواصل مع المدرسة'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.authButton, styles.loginButton]}
            onPress={handleLogin}
          >
            <Icon name="login" size={32} color="#4F46E5" />
            <Text style={[styles.authButtonText, { color: '#4F46E5' }]}>
              تسجيل الدخول
            </Text>
            <Text style={[styles.authButtonSubtext, { color: '#6B7280' }]}>
              لديك حساب بالفعل؟ أدخل بياناتك
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-right" size={24} color="#6B7280" />
            <Text style={styles.backButtonText}>العودة لاختيار الفضاء</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 28,
  },
  buttonsContainer: {
    gap: 20,
  },
  authButton: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  signupButton: {
    backgroundColor: '#4F46E5',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  authButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  authButtonSubtext: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
});

export default AuthSelectionScreen;