import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AuthInput from "../../components/common/AuthInput";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  UserRoles,
  GradeLevels,
  SchoolTypes,
  RelationshipTypes,
} from "../../utils/constants";
import { useAuth } from "../../hooks/AuthContext";
const SignupScreen = ({ navigation, route }) => {
  const { role } = route.params;
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",

    studentId: "",
    grade: "",
    schoolName: "",
    schoolType: "",
    birthDate: "",
    parentEmail: "",

    teacherId: "",
    subject: "جغرافيا",
    yearsOfExperience: "",
    qualification: "",
    school: "",

    relationship: "",
    studentIds: "",
    studentsCount: "",
    address: "",

    acceptTerms: false,
    subscribeNewsletter: false,
  });

  const getRoleFields = () => {
    const commonFields = [
      {
        key: "fullName",
        label: "الاسم الكامل",
        placeholder: "أدخل اسمك الكامل",
        icon: "account",
        required: true,
        autoCapitalize: "words",
      },
      {
        key: "email",
        label: "البريد الإلكتروني",
        placeholder: "example@email.com",
        icon: "email",
        keyboardType: "email-address",
        required: true,
      },
      {
        key: "phoneNumber",
        label: "رقم الهاتف",
        placeholder: "05XXXXXXXX",
        icon: "phone",
        keyboardType: "phone-pad",
        required: true,
      },
      {
        key: "password",
        label: "كلمة المرور",
        placeholder: "أدخل كلمة مرور قوية",
        icon: "lock",
        secureTextEntry: true,
        required: true,
      },
      {
        key: "confirmPassword",
        label: "تأكيد كلمة المرور",
        placeholder: "أعد إدخال كلمة المرور",
        icon: "lock-check",
        secureTextEntry: true,
        required: true,
      },
    ];

    if (role === UserRoles.STUDENT) {
      return [
        ...commonFields,
        {
          key: "studentId",
          label: "رقم الطالب",
          placeholder: "رقم الطالب المدرسي",
          icon: "identifier",
          required: true,
        },
        {
          key: "grade",
          label: "الصف الدراسي",
          placeholder: "اختر الصف الدراسي",
          icon: "school",
          picker: true,
          options: GradeLevels,
          required: true,
        },
        {
          key: "birthDate",
          label: "تاريخ الميلاد",
          placeholder: "YYYY-MM-DD",
          icon: "cake",
          keyboardType: "numbers-and-punctuation",
          required: true,
        },
        {
          key: "schoolName",
          label: "اسم المدرسة",
          placeholder: "أدخل اسم المدرسة",
          icon: "office-building",
          required: true,
        },
        {
          key: "schoolType",
          label: "نوع المدرسة",
          placeholder: "اختر نوع المدرسة",
          icon: "home-city",
          picker: true,
          options: SchoolTypes,
          required: true,
        },
        {
          key: "parentEmail",
          label: "بريد ولي الأمر (اختياري)",
          placeholder: "parent@email.com",
          icon: "account-child",
          keyboardType: "email-address",
          required: false,
        },
      ];
    }

    if (role === UserRoles.TEACHER) {
      return [
        ...commonFields,
        {
          key: "teacherId",
          label: "رقم المعلم",
          placeholder: "رقم الهوية المهنية",
          icon: "card-account-details",
          required: true,
        },
        {
          key: "qualification",
          label: "المؤهل العلمي",
          placeholder: "البكالوريوس، الماجستير، الدكتوراه",
          icon: "certificate",
          required: true,
        },
        {
          key: "yearsOfExperience",
          label: "سنوات الخبرة",
          placeholder: "عدد سنوات التدريس",
          icon: "clock",
          keyboardType: "numeric",
          required: true,
        },
        {
          key: "subject",
          label: "المادة الدراسية",
          placeholder: "جغرافيا",
          icon: "book-open",
          editable: false,
          required: true,
        },
        {
          key: "school",
          label: "اسم المدرسة",
          placeholder: "المدرسة التي تعمل بها",
          icon: "office-building",
          required: true,
        },
      ];
    }

    if (role === UserRoles.PARENT) {
      return [
        ...commonFields,
        {
          key: "relationship",
          label: "صلة القرابة",
          placeholder: "اختر صلة القرابة",
          icon: "family-tree",
          picker: true,
          options: RelationshipTypes,
          required: true,
        },
        {
          key: "studentsCount",
          label: "عدد الأبناء",
          placeholder: "عدد الأبناء في المدرسة",
          icon: "account-multiple",
          keyboardType: "numeric",
          required: true,
        },
        {
          key: "studentIds",
          label: "أرقام الطلاب (اختياري)",
          placeholder: "أرقام الطلاب مفصولة بفواصل",
          icon: "account-child",
          multiline: true,
          required: false,
        },
        {
          key: "address",
          label: "العنوان",
          placeholder: "العنوان الكامل",
          icon: "home",
          multiline: true,
          required: true,
        },
      ];
    }

    return commonFields;
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignup = async () => {
    const requiredFields = getRoleFields().filter((field) => field.required);
    const missingFields = requiredFields.filter(
      (field) => !formData[field.key]
    );

    if (missingFields.length > 0) {
      Alert.alert("خطأ", "الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("خطأ", "كلمتا المرور غير متطابقتين");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("خطأ", "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (!formData.acceptTerms) {
      Alert.alert("خطأ", "يجب الموافقة على الشروط والأحكام");
      return;
    }

    setLoading(true);
    const userData = {
      email: formData.email,
      password: formData.password,
      role: role,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      // Add role-specific data
      ...(role === UserRoles.STUDENT && {
        studentId: formData.studentId,
        grade: formData.grade,
        schoolName: formData.schoolName,
        schoolType: formData.schoolType,
        birthDate: formData.birthDate,
        parentEmail: formData.parentEmail,
      }),
      ...(role === UserRoles.TEACHER && {
        teacherId: formData.teacherId,
        subject: formData.subject,
        yearsOfExperience: formData.yearsOfExperience,
        qualification: formData.qualification,
        school: formData.school,
      }),
      ...(role === UserRoles.PARENT && {
        relationship: formData.relationship,
        studentIds: formData.studentIds,
        studentsCount: formData.studentsCount,
        address: formData.address,
      }),
    };

    // Call Firebase signup
    const result = await signup(formData.email, formData.password, userData);
    setLoading(false);

    if (result.success) {
      Alert.alert("نجاح", `تم إنشاء حساب ${getRoleTitle()} بنجاح`, [
        {
          text: "تم",
        },
      ]);
    } else {
      // Handle specific Firebase errors
      let errorMessage = "حدث خطأ أثناء إنشاء الحساب";

      if (result.error.includes("email-already-in-use")) {
        errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل";
      } else if (result.error.includes("weak-password")) {
        errorMessage = "كلمة المرور ضعيفة جداً";
      } else if (result.error.includes("invalid-email")) {
        errorMessage = "البريد الإلكتروني غير صالح";
      }

      Alert.alert("خطأ", errorMessage);
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case UserRoles.STUDENT:
        return "تلميذ";
      case UserRoles.TEACHER:
        return "معلم";
      case UserRoles.PARENT:
        return "ولي أمر";
      default:
        return "مستخدم";
    }
  };

  const renderField = (field) => {
    if (field.picker) {
      return (
        <AuthInput
          key={field.key}
          label={field.label}
          value={formData[field.key]}
          onChangeText={(value) => handleInputChange(field.key, value)}
          placeholder={field.placeholder}
          icon={field.icon}
          editable={field.editable !== false}
          keyboardType={field.keyboardType}
          autoCapitalize={field.autoCapitalize}
          multiline={field.multiline}
        />
      );
    }

    return (
      <AuthInput
        key={field.key}
        label={field.label}
        value={formData[field.key]}
        onChangeText={(value) => handleInputChange(field.key, value)}
        placeholder={field.placeholder}
        icon={field.icon}
        secureTextEntry={field.secureTextEntry}
        editable={field.editable !== false}
        keyboardType={field.keyboardType}
        autoCapitalize={field.autoCapitalize}
        multiline={field.multiline}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-right" size={24} color="#4F46E5" />
          </TouchableOpacity>

          <Text style={styles.title}>إنشاء حساب {getRoleTitle()}</Text>
          <Text style={styles.subtitle}>
            {role === UserRoles.STUDENT
              ? "سجل الآن وابدأ رحلتك التعليمية"
              : role === UserRoles.TEACHER
              ? "انضم إلى مجتمع المعلمين"
              : "تابع مستوى أبنائك وتواصل مع المدرسة"}
          </Text>
        </View>

        <View style={styles.form}>
          {getRoleFields().map(renderField)}

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                formData.acceptTerms && styles.checkboxChecked,
              ]}
              onPress={() =>
                handleInputChange("acceptTerms", !formData.acceptTerms)
              }
            >
              {formData.acceptTerms && (
                <Icon name="check" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              أوافق على الشروط والأحكام وسياسة الخصوصية
            </Text>
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                formData.subscribeNewsletter && styles.checkboxChecked,
              ]}
              onPress={() =>
                handleInputChange(
                  "subscribeNewsletter",
                  !formData.subscribeNewsletter
                )
              }
            >
              {formData.subscribeNewsletter && (
                <Icon name="check" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              أرغب في تلقي النشرات الإخبارية والعروض
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.signupButton,
              loading && styles.signupButtonDisabled,
            ]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="account-plus" size={24} color="#FFFFFF" />
                <Text style={styles.signupButtonText}>إنشاء الحساب</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login", { role })}
          >
            <Text style={styles.loginText}>
              لديك حساب بالفعل؟{" "}
              <Text style={styles.loginLinkText}>تسجيل الدخول</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 32,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    marginBottom: 40,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    textAlign: "right",
  },
  signupButton: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loginLink: {
    marginTop: 24,
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#6B7280",
  },
  loginLinkText: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
});

export default SignupScreen;
