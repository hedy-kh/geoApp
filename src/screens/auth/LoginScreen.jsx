import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthInput from '../../components/common/AuthInput';
import { UserRoles } from '../../utils/constants';
import { useAuth } from '../../hooks/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
const LoginScreen = ({ navigation, route }) => {
  const { role } = route.params;
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'

  //   const handleLogin = async () => {
  //     if (!formData.email && !formData.phone) {
  //       Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني أو رقم الهاتف');
  //       return;
  //     }

  //     if (!formData.password) {
  //       Alert.alert('خطأ', 'الرجاء إدخال كلمة المرور');
  //       return;
  //     }

  //     if (formData.password.length < 6) {
  //       Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
  //       return;
  //     }

  //     setLoading(true);
  //     const result = await login(formData.email, formData.password);

  //     console.log('Login data:', { ...formData, role });
  //     setLoading(false);

  //     // Simulate API call
  //     setTimeout(() => {
  //       setLoading(false);

  //       // For demo, navigate to dashboard based on role
  //       Alert.alert(
  //         'تم الدخول بنجاح',
  //         `مرحباً بك في فضاء ${getRoleTitle()}`,
  //         [
  //           {
  //             text: 'متابعة',
  //             onPress: () => {
  //                 switch (role) {
  //   case UserRoles.STUDENT:
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'App', params: { role: 'student' } }],
  //     });
  //     break;

  //   case UserRoles.TEACHER:
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'App', params: { role: 'teacher' } }],
  //     });
  //     break;

  //   case UserRoles.PARENT:
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'App', params: { role: 'parent' } }],
  //     });
  //     break;
  // }

  //             }
  //           }
  //         ]
  //       );
  //     }, 2000);
  //   };
  // Updated handleLogin function in LoginScreen.jsx
  const handleLogin = async () => {
    if (!formData.email) {
      Alert.alert("خطأ", "الرجاء إدخال البريد الإلكتروني");
      return;
    }

    if (!formData.password) {
      Alert.alert("خطأ", "الرجاء إدخال كلمة المرور");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("خطأ", "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        console.log("Login successful");
        Alert.alert("تم الدخول بنجاح", `مرحباً بك في فضاء ${getRoleTitle()}`, [
          { text: "متابعة" },
        ]);
      } else {
        let errorMessage = "حدث خطأ أثناء تسجيل الدخول";

        if (result.error) {
          if (result.error.includes("auth/user-not-found")) {
            errorMessage = "المستخدم غير موجود";
          } else if (result.error.includes("auth/wrong-password")) {
            errorMessage = "كلمة المرور غير صحيحة";
          } else if (result.error.includes("auth/invalid-email")) {
            errorMessage = "البريد الإلكتروني غير صالح";
          } else if (result.error.includes("auth/too-many-requests")) {
            errorMessage = "تم محاولة الدخول مرات عديدة. حاول لاحقاً";
          } else if (result.error.includes("auth/user-disabled")) {
            errorMessage = "تم تعطيل هذا الحساب";
          }
        }

        Alert.alert("خطأ", errorMessage);
        setFormData((prev) => ({ ...prev, password: "" }));
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("خطأ", "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword", { role });
  };

  const getRoleTitle = () => {
    switch (role) {
      case UserRoles.STUDENT:
        return "التلميذ";
      case UserRoles.TEACHER:
        return "المعلم";
      case UserRoles.PARENT:
        return "ولي الأمر";
      default:
        return "المستخدم";
    }
  };

  const getRoleWelcomeText = () => {
    switch (role) {
      case UserRoles.STUDENT:
        return "سجل الدخول للوصول إلى دروسك التفاعلية وتحديات الواقع المعزز";
      case UserRoles.TEACHER:
        return "سجل الدخول لإدارة فصلك الدراسي ومتابعة أداء الطلاب";
      case UserRoles.PARENT:
        return "سجل الدخول لمتابعة مستوى أبنائك والتواصل مع المعلمين";
      default:
        return "سجل الدخول إلى حسابك";
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case UserRoles.STUDENT:
        return "school";
      case UserRoles.TEACHER:
        return "account-tie";
      case UserRoles.PARENT:
        return "account-group";
      default:
        return "account";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-right" size={24} color="#4F46E5" />
              <Text style={styles.backButtonText}>رجوع</Text>
            </TouchableOpacity>

            <View style={styles.roleHeader}>
              <View
                style={[
                  styles.roleIconContainer,
                  { backgroundColor: getRoleColor() },
                ]}
              >
                <Icon name={getRoleIcon()} size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>تسجيل الدخول</Text>
              <Text style={styles.roleTitle}>فضاء {getRoleTitle()}</Text>
              <Text style={styles.subtitle}>{getRoleWelcomeText()}</Text>
            </View>
          </View>

          <View style={styles.form}>
            {/* Login Method Toggle */}
            <View style={styles.loginMethodContainer}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  loginMethod === "email" && styles.methodButtonActive,
                ]}
                onPress={() => setLoginMethod("email")}
              >
                <Icon
                  name="email"
                  size={20}
                  color={loginMethod === "email" ? "#FFFFFF" : "#6B7280"}
                />
                <Text
                  style={[
                    styles.methodButtonText,
                    loginMethod === "email" && styles.methodButtonTextActive,
                  ]}
                >
                  البريد الإلكتروني
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  loginMethod === "phone" && styles.methodButtonActive,
                ]}
                onPress={() => setLoginMethod("phone")}
              >
                <Icon
                  name="phone"
                  size={20}
                  color={loginMethod === "phone" ? "#FFFFFF" : "#6B7280"}
                />
                <Text
                  style={[
                    styles.methodButtonText,
                    loginMethod === "phone" && styles.methodButtonTextActive,
                  ]}
                >
                  رقم الهاتف
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email/Phone Input */}
            <AuthInput
              label={
                loginMethod === "email" ? "البريد الإلكتروني" : "رقم الهاتف"
              }
              value={formData.email}
              onChangeText={(value) =>
                setFormData({ ...formData, email: value })
              }
              placeholder={
                loginMethod === "email" ? "example@email.com" : "05XXXXXXXX"
              }
              icon={loginMethod === "email" ? "email" : "phone"}
              keyboardType={
                loginMethod === "email" ? "email-address" : "phone-pad"
              }
              required
            />

            {/* Password Input */}
            <AuthInput
              label="كلمة المرور"
              value={formData.password}
              onChangeText={(value) =>
                setFormData({ ...formData, password: value })
              }
              placeholder="أدخل كلمة المرور"
              icon={showPassword ? "eye-off" : "eye"}
              secureTextEntry={!showPassword}
              onIconPress={() => setShowPassword(!showPassword)}
              required
            />

            {/* Remember Me & Forgot Password */}
            <View style={styles.rememberContainer}>
              <TouchableOpacity
                style={styles.rememberButton}
                onPress={() =>
                  setFormData({ ...formData, rememberMe: !formData.rememberMe })
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {formData.rememberMe && (
                    <Icon name="check" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.rememberText}>تذكرني</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="login" size={24} color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>أو</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <Text style={styles.socialText}>سجل الدخول باستخدام</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                >
                  <Icon name="google" size={24} color="#DB4437" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                >
                  <Icon name="facebook" size={24} color="#e6e7edff" />
                  <Text style={styles.socialButtonText}>facebook</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>لا تملك حساباً؟</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Signup", { role })}
              >
                <Text style={styles.signupLinkText}>أنشئ حساباً جديداً</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Demo Credentials Banner */}
          <View style={styles.demoBanner}>
            <Icon name="information" size={20} color="#FFFFFF" />
            <Text style={styles.demoText}>
              تجربة التطبيق: يمكنك استخدام بيانات تجريبية للدخول
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Helper function for role colors
const getRoleColor = (role) => {
  switch(role) {
    case UserRoles.STUDENT: return '#3B82F6';
    case UserRoles.TEACHER: return '#10B981';
    case UserRoles.PARENT: return '#8B5CF6';
    default: return '#4F46E5';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4F46E5',
    marginRight: 8,
  },
  roleHeader: {
    alignItems: 'center',
  },
  roleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  form: {
    marginBottom: 30,
  },
  loginMethodContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  methodButtonActive: {
    backgroundColor: '#4F46E5',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  rememberText: {
    fontSize: 14,
    color: '#374151',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  socialText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
    minWidth: 120,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  appleButton: {
    backgroundColor: '#233cdbac',
    borderColor: '#f7e9e9ff',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  googleButtonText: {
    color: '#DB4437',
  },
  appleButtonText: {
    color: '#FFFFFF',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  signupText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signupLinkText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 20,
  },
  demoText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
});

// Add color styles for social buttons
styles.googleButtonText = {
  ...styles.socialButtonText,
  color: '#DB4437',
};

styles.appleButtonText = {
  ...styles.socialButtonText,
  color: '#FFFFFF',
};

export default LoginScreen;