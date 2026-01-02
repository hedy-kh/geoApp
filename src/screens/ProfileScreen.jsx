import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Switch,
  TextInput,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/AuthContext";
const { width } = Dimensions.get("window");

const ProfileScreen = ({ navigation, route }) => {
  const { user, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isNotificationModal, setIsNotificationModal] = useState(false);
  const [isPasswordModal, setIsPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    studentId: "",
    grade: "",
    schoolName: "",
    role: "",
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        studentId: user.studentId || "",
        grade: user.grade || "",
        schoolName: user.schoolName || "",
        role: user.role || "",
      });
    }
  }, [user]);

  // Settings states
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    vibration: false,
    darkMode: false,
    autoPlayVideos: true,
    saveProgress: true,
  });

  // Mock profile stats based on role
  const getRoleStats = () => {
    const role = profileData.role || "student";
    switch (role) {
      case "student":
        return [
          {
            label: "الدروس المكتملة",
            value: "8",
            icon: "📚",
            color: "#3B82F6",
          },
          { label: "النقاط", value: "1250", icon: "⭐", color: "#F59E0B" },
          { label: "الإنجازات", value: "12", icon: "🏆", color: "#10B981" },
          { label: "ترتيب الفصل", value: "3", icon: "📊", color: "#8B5CF6" },
        ];
      case "teacher":
        return [
          {
            label: "الدروس المنشورة",
            value: "24",
            icon: "📖",
            color: "#3B82F6",
          },
          { label: "الطلاب", value: "45", icon: "👥", color: "#10B981" },
          { label: "المشاركات", value: "156", icon: "💬", color: "#F59E0B" },
          { label: "التقييم", value: "4.8", icon: "⭐", color: "#8B5CF6" },
        ];
      case "parent":
        return [
          { label: "الأبناء", value: "3", icon: "👨‍👩‍👧", color: "#3B82F6" },
          { label: "المتابعات", value: "42", icon: "👁️", color: "#10B981" },
          { label: "التواصل", value: "18", icon: "💬", color: "#F59E0B" },
          { label: "الحضور", value: "96%", icon: "✅", color: "#8B5CF6" },
        ];
      default:
        return [];
    }
  };

  // Role-specific icons and colors
  const getRoleInfo = () => {
    const role = profileData.role || "student";
    switch (role) {
      case "student":
        return {
          title: "الملف الشخصي للتلميذ",
          icon: "👨‍🎓",
          color: "#3B82F6",
          bgColor: "#DBEAFE",
        };
      case "teacher":
        return {
          title: "ملف المعلم",
          icon: "👨‍🏫",
          color: "#10B981",
          bgColor: "#D1FAE5",
        };
      case "parent":
        return {
          title: "ملف ولي الأمر",
          icon: "👨‍👩‍👧",
          color: "#8B5CF6",
          bgColor: "#EDE9FE",
        };
      default:
        return {
          title: "الملف الشخصي",
          icon: "👤",
          color: "#4F46E5",
          bgColor: "#EEF2FF",
        };
    }
  };

  const roleInfo = getRoleInfo();
  const stats = getRoleStats();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      Alert.alert("تم الحفظ", "تم تحديث المعلومات بنجاح");
    }, 1500);
  };

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

  const handleSettingToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: roleInfo.bgColor }]}>
      <View style={styles.headerContent}>
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: roleInfo.color }]}>
            <Text style={styles.avatarIcon}>{roleInfo.icon}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {profileData.fullName || "المستخدم"}
            </Text>
            <Text style={styles.userRole}>
              {profileData.role === "student"
                ? "تلميذ"
                : profileData.role === "teacher"
                ? "معلم"
                : profileData.role === "parent"
                ? "ولي أمر"
                : "مستخدم"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Icon
            name={isEditing ? "close" : "pencil"}
            size={24}
            color={roleInfo.color}
          />
          <Text style={[styles.editButtonText, { color: roleInfo.color }]}>
            {isEditing ? "إلغاء" : "تعديل"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsGrid}
      >
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: stat.color + "20" },
              ]}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderProfileInfo = () => (
    <View style={styles.infoSection}>
      <View style={styles.sectionHeader}>
        <Icon name="information" size={24} color={roleInfo.color} />
        <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
      </View>

      <View style={styles.infoGrid}>
        {isEditing ? (
          // Edit Mode
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>الاسم الكامل</Text>
              <TextInput
                style={styles.input}
                value={profileData.fullName}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, fullName: text })
                }
                placeholder="أدخل الاسم الكامل"
                textAlign="right"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
              <TextInput
                value={profileData.email}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, email: text })
                }
                placeholder="example@email.com"
                keyboardType="email-address"
                textAlign="right"
                editable={false} 
                style={[
                  styles.input,
                  { backgroundColor: "#F3F4F6", color: "#9CA3AF" },
                ]}
              />
              <Text style={styles.noteText}>
                البريد الإلكتروني غير قابل للتعديل
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>رقم الهاتف</Text>
              <TextInput
                style={styles.input}
                value={profileData.phoneNumber}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, phoneNumber: text })
                }
                placeholder="05XXXXXXXX"
                keyboardType="phone-pad"
                textAlign="right"
              />
            </View>

            {profileData.role === "student" && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>رقم الطالب</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.studentId}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, studentId: text })
                    }
                    placeholder="رقم الطالب"
                    textAlign="right"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>الصف الدراسي</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.grade}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, grade: text })
                    }
                    placeholder="الصف الدراسي"
                    textAlign="right"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>اسم المدرسة</Text>
                  <TextInput
                    style={styles.input}
                    value={profileData.schoolName}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, schoolName: text })
                    }
                    placeholder="اسم المدرسة"
                    textAlign="right"
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: roleInfo.color }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="content-save" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          // View Mode
          <>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <Icon name="account" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>الاسم الكامل</Text>
              </View>
              <Text style={styles.infoValue}>
                {profileData.fullName || "غير محدد"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <Icon name="email" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>البريد الإلكتروني</Text>
              </View>
              <Text style={styles.infoValue}>
                {profileData.email || "غير محدد"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <Icon name="phone" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>رقم الهاتف</Text>
              </View>
              <Text style={styles.infoValue}>
                {profileData.phoneNumber || "غير محدد"}
              </Text>
            </View>

            {profileData.role === "student" && (
              <>
                {profileData.studentId && (
                  <View style={styles.infoItem}>
                    <View style={styles.infoLabelContainer}>
                      <Icon name="identifier" size={20} color="#6B7280" />
                      <Text style={styles.infoLabel}>رقم الطالب</Text>
                    </View>
                    <Text style={styles.infoValue}>
                      {profileData.studentId}
                    </Text>
                  </View>
                )}

                {profileData.grade && (
                  <View style={styles.infoItem}>
                    <View style={styles.infoLabelContainer}>
                      <Icon name="school" size={20} color="#6B7280" />
                      <Text style={styles.infoLabel}>الصف الدراسي</Text>
                    </View>
                    <Text style={styles.infoValue}>{profileData.grade}</Text>
                  </View>
                )}

                {profileData.schoolName && (
                  <View style={styles.infoItem}>
                    <View style={styles.infoLabelContainer}>
                      <Icon name="office-building" size={20} color="#6B7280" />
                      <Text style={styles.infoLabel}>اسم المدرسة</Text>
                    </View>
                    <Text style={styles.infoValue}>
                      {profileData.schoolName}
                    </Text>
                  </View>
                )}
              </>
            )}

            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <Icon name="account-group" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>الدور</Text>
              </View>
              <Text style={styles.infoValue}>
                {profileData.role === "student"
                  ? "تلميذ"
                  : profileData.role === "teacher"
                  ? "معلم"
                  : profileData.role === "parent"
                  ? "ولي أمر"
                  : profileData.role || "غير محدد"}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsSection}>
      <View style={styles.sectionHeader}>
        <Icon name="cog" size={24} color="#6B7280" />
        <Text style={styles.sectionTitle}>الإعدادات</Text>
      </View>

      <View style={styles.settingsList}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setIsNotificationModal(true)}
        >
          <View style={styles.settingInfo}>
            <Icon name="bell" size={24} color="#4F46E5" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>الإشعارات</Text>
              <Text style={styles.settingSubtitle}>
                إدارة الإشعارات والتنبيهات
              </Text>
            </View>
          </View>
          <Icon name="chevron-left" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="volume-high" size={24} color="#3B82F6" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>المؤثرات الصوتية</Text>
              <Text style={styles.settingSubtitle}>تشغيل/إيقاف الأصوات</Text>
            </View>
          </View>
          <Switch
            value={settings.soundEffects}
            onValueChange={() => handleSettingToggle("soundEffects")}
            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="vibrate" size={24} color="#8B5CF6" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>الاهتزاز</Text>
              <Text style={styles.settingSubtitle}>تفعيل الاهتزاز</Text>
            </View>
          </View>
          <Switch
            value={settings.vibration}
            onValueChange={() => handleSettingToggle("vibration")}
            trackColor={{ false: "#D1D5DB", true: "#8B5CF6" }}
          />
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setIsPasswordModal(true)}
        >
          <View style={styles.settingInfo}>
            <Icon name="lock" size={24} color="#DC2626" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>كلمة المرور</Text>
              <Text style={styles.settingSubtitle}>تغيير كلمة المرور</Text>
            </View>
          </View>
          <Icon name="chevron-left" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="shield-check" size={24} color="#10B981" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>الخصوصية</Text>
              <Text style={styles.settingSubtitle}>إعدادات الخصوصية</Text>
            </View>
          </View>
          <Icon name="chevron-left" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="help-circle" size={24} color="#F59E0B" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>المساعدة والدعم</Text>
              <Text style={styles.settingSubtitle}>مركز المساعدة</Text>
            </View>
          </View>
          <Icon name="chevron-left" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="file-document" size={24} color="#6B7280" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>الشروط والخصوصية</Text>
              <Text style={styles.settingSubtitle}>قراءة الشروط والأحكام</Text>
            </View>
          </View>
          <Icon name="chevron-left" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderLogoutButton = () => (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Icon name="logout" size={24} color="#DC2626" />
      <Text style={styles.logoutText}>تسجيل الخروج</Text>
    </TouchableOpacity>
  );
  const NotificationModal = () => (
    <Modal
      visible={isNotificationModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsNotificationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>إعدادات الإشعارات</Text>
            <TouchableOpacity onPress={() => setIsNotificationModal(false)}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSetting}>
              <Text style={styles.modalSettingTitle}>إشعارات الدروس</Text>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleSettingToggle("notifications")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>

            <View style={styles.modalSetting}>
              <Text style={styles.modalSettingTitle}>تذكيرات المهام</Text>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleSettingToggle("notifications")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>

            <View style={styles.modalSetting}>
              <Text style={styles.modalSettingTitle}>إشعارات التقدم</Text>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleSettingToggle("notifications")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>

            <View style={styles.modalSetting}>
              <Text style={styles.modalSettingTitle}>تنبيهات الألعاب</Text>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleSettingToggle("notifications")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={() => setIsNotificationModal(false)}
            >
              <Text style={styles.modalSaveButtonText}>حفظ الإعدادات</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const PasswordModal = () => (
    <Modal
      visible={isPasswordModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsPasswordModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>تغيير كلمة المرور</Text>
            <TouchableOpacity onPress={() => setIsPasswordModal(false)}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>كلمة المرور الحالية</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="أدخل كلمة المرور الحالية"
                secureTextEntry
                textAlign="right"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>كلمة المرور الجديدة</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="أدخل كلمة المرور الجديدة"
                secureTextEntry
                textAlign="right"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>تأكيد كلمة المرور</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                secureTextEntry
                textAlign="right"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalSaveButton, { backgroundColor: "#DC2626" }]}
              onPress={() => {
                setIsPasswordModal(false);
                Alert.alert("تم", "تم تغيير كلمة المرور بنجاح");
              }}
            >
              <Text style={styles.modalSaveButtonText}>تغيير كلمة المرور</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderStats()}
        {renderProfileInfo()}
        {renderSettings()}
        {renderLogoutButton()}

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.copyrightText}>© 2026 جميع الحقوق محفوظة</Text>
        </View>
      </ScrollView>

      <NotificationModal />
      <PasswordModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    alignItems: "center",
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarIcon: {
    fontSize: 40,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: "#6B7280",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 12,
    paddingBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    paddingRight: 24,
  },
  statCard: {
    width: 160,
    backgroundColor: "#FFFFFF",
    marginRight: 16,
    padding: 10,
    marginBottom: 12,
    borderRadius: 20,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginRight: 12,
  },
  infoGrid: {
    gap: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginRight: 12,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    textAlign: "right",
  },
  noteText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    fontStyle: "italic",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    gap: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  settingsSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginRight: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 20,
    borderRadius: 20,
    gap: 12,
    borderWidth: 2,
    borderColor: "#FECACA",
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DC2626",
  },
  versionContainer: {
    alignItems: "center",
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: "#D1D5DB",
  },
  // Modal Styles (same as before)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  modalContent: {
    padding: 24,
  },
  modalSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalSettingTitle: {
    fontSize: 16,
    color: "#374151",
  },
  modalInputGroup: {
    marginBottom: 20,
  },
  modalInputLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "600",
  },
  modalInput: {
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    textAlign: "right",
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  modalSaveButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default ProfileScreen;
