import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
import { DrawerActions } from '@react-navigation/native';

const isSmallScreen = width < 375;

const ParentDashboard = ({ navigation }) => {
  const [notifications, setNotifications] = useState([
    { id: 'n1', sender: 'أ. سعاد', message: 'أحمد يحتاج لتركيز أكثر في حفظ تضاريس المغرب العربي، أرجو مراجعته في المنزل.', date: 'اليوم', signed: false },
    { id: 'n2', sender: 'الإدارة', message: 'يرجى تأكيد مشاركة أحمد في رحلة "المغامر الجغرافي" يوم الخميس.', date: 'أمس', signed: true },
  ]);

  const [missions, setMissions] = useState([
    { id: 'm1', title: 'مراجعة العواصم', description: 'اختبر طفلك في عواصم المغرب العربي الخمس.', isCompleted: false, pointsAwarded: 50 },
    { id: 'm2', title: 'رحلة الخريطة', description: 'شاهد مع طفلك فيديو "الموقع والمساحة" وناقشه في الحدود.', isCompleted: true, pointsAwarded: 30 },
  ]);

  const handleSign = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, signed: true } : n
    ));
    Alert.alert('تم التوقيع', 'شكراً لتواصلك مع المدرسة');
    };
   

  const toggleMission = (id) => {
    setMissions(missions.map(m => 
      m.id === id ? { ...m, isCompleted: !m.isCompleted } : m
    ));
  };
    const handleDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
      console.log(navigation.getState().type);
    }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Fixed Header */}
      <View style={styles.header}>
<TouchableOpacity 
  style={styles.headerButton}
onPress={handleDrawer}
>
  <Icon name="menu" size={24} color="#374151" />
</TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>فضاء ولي الأمر</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <View style={styles.badgeContainer}>
            <Icon name="bell" size={22} color="#8B5CF6" />
            {notifications.filter(n => !n.signed).length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notifications.filter(n => !n.signed).length}
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
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>👨‍👩‍👧</Text>
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>مرحباً بك في فضاء الولي الشريك</Text>
            <Text style={styles.welcomeSubtitle}>
              تابع تقدم بطلكم الصغير وشاركه في مغامراته الجغرافية اليومية
            </Text>
          </View>
        </View>

        {/* Stats Cards - Horizontal Scroll */}
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
              <Text style={styles.statValue}>88%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '88%' }]} />
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, styles.statIconOrange]}>
                <Text style={styles.statIcon}>🎨</Text>
              </View>
              <Text style={styles.statLabel}>الإبداع</Text>
              <Text style={styles.statValue}>ممتاز</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={styles.star}>⭐</Text>
                ))}
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, styles.statIconGreen]}>
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

        {/* Missions Section */}
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
            {missions.map(mission => (
              <TouchableOpacity
                key={mission.id}
                style={[
                  styles.missionCard,
                  mission.isCompleted && styles.missionCardCompleted
                ]}
                onPress={() => toggleMission(mission.id)}
                activeOpacity={0.7}
              >
                <View style={styles.missionHeader}>
                  <View style={styles.missionInfo}>
                    <View style={[
                      styles.missionStatus,
                      mission.isCompleted && styles.missionStatusCompleted
                    ]}>
                      {mission.isCompleted ? (
                        <Icon name="check-circle" size={20} color="#10B981" />
                      ) : (
                        <Icon name="circle-outline" size={20} color="#6B7280" />
                      )}
                    </View>
                    <View style={styles.missionTextContainer}>
                      <Text style={styles.missionTitle}>{mission.title}</Text>
                      <Text style={styles.missionDescription}>{mission.description}</Text>
                    </View>
                  </View>
                  <View style={styles.pointsContainer}>
                    <Text style={styles.pointsText}>+{mission.pointsAwarded}</Text>
                    <Text style={styles.pointsLabel}>نقطة</Text>
                  </View>
                </View>
                <View style={styles.missionFooter}>
                  <TouchableOpacity
                    style={[
                      styles.missionButton,
                      mission.isCompleted && styles.missionButtonCompleted
                    ]}
                    onPress={() => toggleMission(mission.id)}
                  >
                    <Text style={[
                      styles.missionButtonText,
                      mission.isCompleted && styles.missionButtonTextCompleted
                    ]}>
                      {mission.isCompleted ? 'تم الإكمال' : 'تأكيد الإكمال'}
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
                {notifications.filter(n => !n.signed).length} جديد
              </Text>
            </View>
          </View>

          <View style={styles.notificationsContainer}>
            {notifications.map(note => (
              <View key={note.id} style={styles.notificationCard}>
                <View style={styles.notificationHeader}>
                  <View style={styles.teacherInfo}>
                    <View style={styles.teacherAvatar}>
                      <Text style={styles.teacherIcon}>
                        {note.sender === 'الإدارة' ? '🏢' : '👩‍🏫'}
                      </Text>
                    </View>
                    <View style={styles.teacherDetails}>
                      <Text style={styles.teacherName}>{note.sender}</Text>
                      <Text style={styles.notificationDate}>{note.date}</Text>
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
                <Text style={styles.notificationMessage}>{note.message}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#EDE9FE',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarIcon: {
    fontSize: 40,
  },
  welcomeTextContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
    maxWidth: '90%',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '90%',
  },
  statsSection: {
    marginBottom: 20,
  },
  statsScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconBlue: {
    backgroundColor: '#DBEAFE',
  },
  statIconOrange: {
    backgroundColor: '#FEF3C7',
  },
  statIconGreen: {
    backgroundColor: '#D1FAE5',
  },
  statIcon: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 12,
    marginRight: 2,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankText: {
    fontSize: 10,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  notificationIndicator: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notificationIndicatorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  missionsContainer: {
    gap: 12,
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  missionCardCompleted: {
    opacity: 0.7,
    borderColor: '#D1FAE5',
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  missionStatus: {
    paddingTop: 2,
  },
  missionStatusCompleted: {
    // Keep existing styles
  },
  missionTextContainer: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  pointsLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  missionFooter: {
    marginTop: 8,
  },
  missionButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  missionButtonCompleted: {
    backgroundColor: '#10B981',
  },
  missionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  missionButtonTextCompleted: {
    color: '#FFFFFF',
  },
  notificationsContainer: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#EDE9FE',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teacherIcon: {
    fontSize: 20,
  },
  teacherDetails: {
    flex: 1,
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  notificationDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  signedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  signedText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  signButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  signButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
});

export default ParentDashboard;