import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const ACHIEVEMENTS_DATA = [
  {
    id: '1',
    title: 'المستكشف المبتدئ',
    description: 'إكمال أول درس في التطبيق',
    icon: '🥇',
    unlocked: true,
    date: '2023-11-10',
    points: 100
  },
  {
    id: '2',
    title: 'بطل الاختبارات',
    description: 'الحصول على 90% في 3 اختبارات متتالية',
    icon: '🏆',
    unlocked: true,
    date: '2023-11-15',
    points: 200
  },
  {
    id: '3',
    title: 'سيد الألعاب',
    description: 'إكمال جميع الألعاب التعليمية',
    icon: '🎮',
    unlocked: false,
    points: 150
  },
  {
    id: '4',
    title: 'رحالة الواقع المعزز',
    description: 'إكمال 5 تجارب AR',
    icon: '📸',
    unlocked: false,
    points: 250
  },
  {
    id: '5',
    title: 'القارئ الذهبي',
    description: 'قراءة جميع الملخصات التعليمية',
    icon: '📚',
    unlocked: true,
    date: '2023-11-18',
    points: 120
  }
];

const StudentTrophyScreen = () => {
  const totalPoints = ACHIEVEMENTS_DATA
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);
  
  const unlockedCount = ACHIEVEMENTS_DATA.filter(a => a.unlocked).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Stats */}
        <View style={styles.statsHeader}>
          <View style={styles.statsCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarIcon}>👦</Text>
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.rankTitle}>الرتبة</Text>
                <Text style={styles.rankValue}>مغامر ذهبي</Text>
              </View>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalPoints}</Text>
                <Text style={styles.statLabel}>إجمالي النقاط</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{unlockedCount}</Text>
                <Text style={styles.statLabel}>إنجازات</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>دروس مكتملة</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>تقدم الإنجازات</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {unlockedCount} من {ACHIEVEMENTS_DATA.length} إنجاز
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round((unlockedCount / ACHIEVEMENTS_DATA.length) * 100)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(unlockedCount / ACHIEVEMENTS_DATA.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Achievements List */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>الإنجازات 🏆</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS_DATA.map(achievement => (
              <View 
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementCardLocked
                ]}
              >
                <View style={styles.achievementIconContainer}>
                  <Text style={[
                    styles.achievementIcon,
                    !achievement.unlocked && styles.achievementIconLocked
                  ]}>
                    {achievement.icon}
                  </Text>
                </View>
                
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  
                  <View style={styles.achievementFooter}>
                    <View style={styles.pointsBadge}>
                      <Icon name="star" size={14} color="#F59E0B" />
                      <Text style={styles.pointsText}>{achievement.points} نقطة</Text>
                    </View>
                    
                    {achievement.unlocked ? (
                      <View style={styles.unlockedBadge}>
                        <Icon name="check-circle" size={16} color="#10B981" />
                        <Text style={styles.unlockedText}>
                          {achievement.date}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.lockedBadge}>
                        <Icon name="lock" size={16} color="#9CA3AF" />
                        <Text style={styles.lockedText}>مقفل</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Trophy Case */}
        <View style={styles.trophyCaseSection}>
          <Text style={styles.sectionTitle}>خزانة الجوائز 🏅</Text>
          <View style={styles.trophyCase}>
            <View style={styles.trophyItem}>
              <View style={styles.trophyIcon}>
                <Icon name="trophy" size={40} color="#FBBF24" />
              </View>
              <Text style={styles.trophyLabel}>كأس التقدم</Text>
            </View>
            <View style={styles.trophyItem}>
              <View style={styles.trophyIcon}>
                <Icon name="medal" size={40} color="#6B7280" />
              </View>
              <Text style={styles.trophyLabel}>الميدالية الفضية</Text>
            </View>
            <View style={styles.trophyItem}>
              <View style={styles.trophyIcon}>
                <Icon name="crown" size={40} color="#F59E0B" />
              </View>
              <Text style={styles.trophyLabel}>تاج المعرفة</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollView: {
    flex: 1,
  },
  statsHeader: {
    padding: 20,
  },
  statsCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatarIcon: {
    fontSize: 40,
  },
  rankInfo: {
    flex: 1,
  },
  rankTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  rankValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FBBF24',
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'right',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
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
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 16,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  achievementsGrid: {
    gap: 16,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
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
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIconContainer: {
    marginLeft: 16,
  },
  achievementIcon: {
    fontSize: 40,
  },
  achievementIconLocked: {
    opacity: 0.4,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    marginRight: 6,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockedText: {
    fontSize: 12,
    color: '#10B981',
    marginRight: 6,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 6,
  },
  trophyCaseSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  trophyCase: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trophyItem: {
    alignItems: 'center',
  },
  trophyIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
  trophyLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default StudentTrophyScreen;