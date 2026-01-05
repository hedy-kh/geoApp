import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/AuthContext";
import { DrawerActions } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase.config";

const { width, height } = Dimensions.get("window");
const isSmallScreen = width < 375;

const ParentDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [linkedStudent, setLinkedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      sender: "أ. سعاد",
      message:
        "يحتاج لتركيز أكثر في حفظ تضاريس المغرب العربي، أرجو مراجعته في المنزل.",
      date: "اليوم",
      signed: false,
    },
    {
      id: "n2",
      sender: "الإدارة",
      message:
        'يرجى تأكيد مشاركة ابنك/ابنتك في رحلة "المغامر الجغرافي" يوم الخميس.',
      date: "أمس",
      signed: true,
    },
  ]);

  const [missions, setMissions] = useState([
    {
      id: "m1",
      title: "مراجعة العواصم",
      description: "اختبر طفلك في عواصم المغرب العربي الخمس.",
      isCompleted: false,
      pointsAwarded: 50,
    },
    {
      id: "m2",
      title: "رحلة الخريطة",
      description: 'شاهد مع طفلك فيديو "الموقع والمساحة" وناقشه في الحدود.',
      isCompleted: true,
      pointsAwarded: 30,
    },
  ]);

  // Fetch linked student data
  useEffect(() => {
    const fetchLinkedStudent = async () => {
      if (!user || !user.studentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Query students collection where studentId matches parent's studentId
        const studentsRef = collection(db, "users");
        const q = query(
          studentsRef,
          where("role", "==", "student"),
          where("studentId", "==", user.studentId)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Get the first matching student
          const studentDoc = querySnapshot.docs[0];
          const studentData = studentDoc.data();

          setLinkedStudent({
            id: studentDoc.id,
            fullName: studentData.fullName,
            grade: studentData.grade,
            schoolName: studentData.schoolName,
            email: studentData.email,
            studentId: studentData.studentId,
          });
        } else {
          setLinkedStudent(null);
        }
      } catch (error) {
        console.error("Error fetching linked student:", error);
        Alert.alert("خطأ", "حدث خطأ أثناء تحميل بيانات الطالب");
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedStudent();
  }, [user]);

  const handleSign = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, signed: true } : n))
    );
    Alert.alert("تم التوقيع", "شكراً لتواصلك مع المدرسة");
  };

  const toggleMission = (id) => {
    setMissions(
      missions.map((m) =>
        m.id === id ? { ...m, isCompleted: !m.isCompleted } : m
      )
    );
  };

  const handleDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleDrawer}>
          <Icon name="menu" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>فضاء ولي الأمر</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <View style={styles.badgeContainer}>
            <Icon name="bell" size={22} color="#8B5CF6" />
            {notifications.filter((n) => !n.signed).length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notifications.filter((n) => !n.signed).length}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section with Student Info */}
        <View style={styles.welcomeSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>👨‍👩‍👧</Text>
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>
              مرحباً بك في فضاء الولي الشريك
            </Text>

            {linkedStudent ? (
              <View style={styles.studentInfoCard}>
                <View style={styles.studentInfoHeader}>
                  <Icon name="account-circle" size={20} color="#8B5CF6" />
                  <Text style={styles.studentInfoTitle}>
                    معلومات الطالب المرتبط
                  </Text>
                </View>
                <View style={styles.studentInfoContent}>
                  <View style={styles.studentInfoRow}>
                    <Text style={styles.studentInfoLabel}>الاسم:</Text>
                    <Text style={styles.studentInfoValue}>
                      {linkedStudent.fullName}
                    </Text>
                  </View>
                  <View style={styles.studentInfoRow}>
                    <Text style={styles.studentInfoLabel}>السنة الدراسية:</Text>
                    <Text style={styles.studentInfoValue}>
                      {linkedStudent.grade}
                    </Text>
                  </View>
                  {linkedStudent.schoolName && (
                    <View style={styles.studentInfoRow}>
                      <Text style={styles.studentInfoLabel}>المدرسة:</Text>
                      <Text style={styles.studentInfoValue}>
                        {linkedStudent.schoolName}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.noStudentCard}>
                <Icon name="account-alert" size={48} color="#F59E0B" />
                <Text style={styles.noStudentTitle}>لا يوجد طالب مرتبط</Text>
                <Text style={styles.noStudentMessage}>
                  لم يتم العثور على طالب مسجل بنفس رقم التعريف الطلابي.
                  {"\n"}
                  يرجى التأكد من رقم التعريف أو التواصل مع إدارة المدرسة.
                </Text>
                <TouchableOpacity style={styles.contactButton}>
                  <Icon name="phone" size={18} color="#FFFFFF" />
                  <Text style={styles.contactButtonText}>
                    التواصل مع الإدارة
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Only show stats if student is linked */}
        {linkedStudent && (
          <>
            <View style={styles.statsSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statsScrollContent}
              >
                <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, styles.statIconBlue]}>
                    <Text style={styles.statIcon}>📊</Text>
                  </View>
                  <Text style={styles.statLabel}>التقدم الدراسي</Text>
                  <Text style={styles.statValue}>89%</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: "88%" }]} />
                  </View>
                </View>
                <View style={styles.statCard}>
                  <View
                    style={[styles.statIconContainer, styles.statIconOrange]}
                  >
                    <Text style={styles.statIcon}>🎨</Text>
                  </View>
                  <Text style={styles.statLabel}>الإبداع</Text>
                  <Text style={styles.statValue}>ممتاز</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text key={star} style={styles.star}>
                        ⭐
                      </Text>
                    ))}
                  </View>
                </View>
                <View style={styles.statCard}>
                  <View
                    style={[styles.statIconContainer, styles.statIconGreen]}
                  >
                    <Text style={styles.statIcon}>🏆</Text>
                  </View>
                  <Text style={styles.statLabel}>ترتيب الفصل</Text>
                  <Text style={styles.statValue}>المركز 3</Text>
                  <View style={styles.rankContainer}>
                    <Icon name="trophy" size={20} color="#F59E0B" />
                    <Text style={styles.rankText}>من أصل 25 طالب</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionIcon}>🎯</Text>
                  <Text style={styles.sectionTitle}>مهام اليوم</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>عرض الكل</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.missionsContainer}>
                {missions.map((mission) => (
                  <TouchableOpacity
                    key={mission.id}
                    style={[
                      styles.missionCard,
                      mission.isCompleted && styles.missionCardCompleted,
                    ]}
                    onPress={() => toggleMission(mission.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.missionHeader}>
                      <View style={styles.missionInfo}>
                        <View
                          style={[
                            styles.missionStatus,
                            mission.isCompleted &&
                              styles.missionStatusCompleted,
                          ]}
                        >
                          {mission.isCompleted ? (
                            <Icon
                              name="check-circle"
                              size={20}
                              color="#10B981"
                            />
                          ) : (
                            <Icon
                              name="circle-outline"
                              size={20}
                              color="#6B7280"
                            />
                          )}
                        </View>
                        <View style={styles.missionTextContainer}>
                          <Text style={styles.missionTitle}>
                            {mission.title}
                          </Text>
                          <Text style={styles.missionDescription}>
                            {mission.description}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.pointsContainer}>
                        <Text style={styles.pointsText}>
                          +{mission.pointsAwarded}
                        </Text>
                        <Text style={styles.pointsLabel}>نقطة</Text>
                      </View>
                    </View>
                    <View style={styles.missionFooter}>
                      <TouchableOpacity
                        style={[
                          styles.missionButton,
                          mission.isCompleted && styles.missionButtonCompleted,
                        ]}
                        onPress={() => toggleMission(mission.id)}
                      >
                        <Text
                          style={[
                            styles.missionButtonText,
                            mission.isCompleted &&
                              styles.missionButtonTextCompleted,
                          ]}
                        >
                          {mission.isCompleted ? "تم الإكمال" : "تأكيد الإكمال"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Communications Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionIcon}>📒</Text>
                  <Text style={styles.sectionTitle}>كراس التواصل</Text>
                </View>
                <View style={styles.notificationIndicator}>
                  <Text style={styles.notificationIndicatorText}>
                    {notifications.filter((n) => !n.signed).length} جديد
                  </Text>
                </View>
              </View>
              <View style={styles.notificationsContainer}>
                {notifications.map((note) => (
                  <View key={note.id} style={styles.notificationCard}>
                    <View style={styles.notificationHeader}>
                      <View style={styles.teacherInfo}>
                        <View style={styles.teacherAvatar}>
                          <Text style={styles.teacherIcon}>
                            {note.sender === "الإدارة" ? "🏢" : "👩‍🏫"}
                          </Text>
                        </View>
                        <View style={styles.teacherDetails}>
                          <Text style={styles.teacherName}>{note.sender}</Text>
                          <Text style={styles.notificationDate}>
                            {note.date}
                          </Text>
                        </View>
                      </View>
                      {note.signed ? (
                        <View style={styles.signedBadge}>
                          <Icon name="check-circle" size={16} color="#10B981" />
                          <Text style={styles.signedText}>تم الاطلاع</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.signButton}
                          onPress={() => handleSign(note.id)}
                        >
                          <Icon name="pencil" size={16} color="#FFFFFF" />
                          <Text style={styles.signButtonText}>توقيع</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.notificationMessage}>
                      {note.message}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  badgeContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  welcomeSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  avatarIcon: {
    fontSize: 40,
  },
  welcomeTextContainer: {
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
  },
  studentInfoCard: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  studentInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  studentInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginRight: 8,
  },
  studentInfoContent: {
    gap: 8,
  },
  studentInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studentInfoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  studentInfoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  noStudentCard: {
    width: "100%",
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  noStudentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400E",
    marginTop: 12,
    marginBottom: 8,
  },
  noStudentMessage: {
    fontSize: 14,
    color: "#78350F",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  statsSection: {
    paddingVertical: 16,
  },
  statsScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginBottom:12,
    width: width * 0.6,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statIconBlue: {
    backgroundColor: "#DBEAFE",
  },
  statIconOrange: {
    backgroundColor: "#FEF3C7",
  },
  statIconGreen: {
    backgroundColor: "#D1FAE5",
  },
  statIcon: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 3,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 4,
  },
  star: {
    fontSize: 16,
  },
  rankContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rankText: {
    fontSize: 12,
    color: "#6B7280",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  seeAllText: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  notificationIndicator: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notificationIndicatorText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  missionsContainer: {
    gap: 12,
  },
  missionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  missionCardCompleted: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },
  missionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  missionInfo: {
    flexDirection: "row",
    flex: 1,
  },
  missionStatus: {
    marginLeft: 12,
  },
  missionTextContainer: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  pointsContainer: {
    alignItems: "center",
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F59E0B",
  },
  pointsLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  missionFooter: {
    marginTop: 8,
  },
  missionButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  missionButtonCompleted: {
    backgroundColor: "#10B981",
  },
  missionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  missionButtonTextCompleted: {
    color: "#FFFFFF",
  },
  notificationsContainer: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  teacherInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  teacherIcon: {
    fontSize: 20,
  },
  teacherDetails: {
    flex: 1,
  },
  teacherName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  notificationDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  signedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  signedText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  signButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  signButtonText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ParentDashboard;
