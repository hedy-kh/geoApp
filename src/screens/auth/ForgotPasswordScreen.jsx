import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AuthInput from '../../components/common/AuthInput';
import { SafeAreaView } from 'react-native-safe-area-context';
const ForgotPasswordScreen = ({ navigation, route }) => {
  const { role } = route.params;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); 

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);
    
    // TODO: Firebase send reset code
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      Alert.alert('تم الإرسال', 'تم إرسال رمز التحقق إلى بريدك الإلكتروني');
    }, 1500);
  };

  const handleResetPassword = async () => {
    // TODO: Firebase reset password
    setTimeout(() => {
      Alert.alert('نجاح', 'تم تغيير كلمة المرور بنجاح', [
        {
          text: 'تسجيل الدخول',
          onPress: () => navigation.navigate('Login', { role })
        }
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-right" size={24} color="#4F46E5" />
            <Text style={styles.backButtonText}>رجوع</Text>
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <Icon name="lock-reset" size={60} color="#4F46E5" />
          </View>
          
          <Text style={styles.title}>استعادة كلمة المرور</Text>
          <Text style={styles.subtitle}>
            أدخل بريدك الإلكتروني لاستعادة حسابك
          </Text>
        </View>

        <View style={styles.form}>
          {step === 1 && (
            <>
              <AuthInput
                label="البريد الإلكتروني"
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                icon="email"
                keyboardType="email-address"
                required
              />
              
              <TouchableOpacity 
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSendCode}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="send" size={24} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>إرسال رمز التحقق</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.stepInfo}>
                أدخل الرمز المكون من 6 أرقام المرسل إلى {email}
              </Text>
              
              {/* Code input would go here */}
              
              <TouchableOpacity style={styles.resendButton}>
                <Text style={styles.resendText}>لم تستلم الرمز؟ إعادة الإرسال</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login', { role })}
          >
            <Text style={styles.loginLinkText}>تذكرت كلمة المرور؟ تسجيل الدخول</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4F46E5',
    marginRight: 8,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 40,
  },
  stepInfo: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resendButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    padding: 16,
    marginTop: 30,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;