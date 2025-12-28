import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CURRICULUM = [
  {
    id: 'unit-1',
    title: 'المغرب العربي: الموقع والمساحة',
    description: 'استكشاف موقع ومساحة دول المغرب العربي',
    icon: '🌍',
    lessonsCount: 4,
    color: '#3B82F6',
    bgColor: '#DBEAFE'
  },
  {
    id: 'unit-2',
    title: 'التضاريس والمناخ',
    description: 'دراسة تضاريس ومناخ المنطقة',
    icon: '⛰️',
    lessonsCount: 5,
    color: '#10B981',
    bgColor: '#D1FAE5'
  },
  {
    id: 'unit-3',
    title: 'الموارد الطبيعية',
    description: 'تعرف على موارد المنطقة الطبيعية',
    icon: '💎',
    lessonsCount: 3,
    color: '#F59E0B',
    bgColor: '#FEF3C7'
  },
  {
    id: 'unit-4',
    title: 'السكان والثقافة',
    description: 'دراسة سكان وثقافة المغرب العربي',
    icon: '👥',
    lessonsCount: 4,
    color: '#8B5CF6',
    bgColor: '#EDE9FE'
  }
];

const StudentUnitsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-right" size={24} color="#4F46E5" />
            <Text style={styles.backButtonText}>رجوع</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>المحاور الدراسية 📚</Text>
            <Text style={styles.headerSubtitle}>اختر المحور الذي تريد دراسته</Text>
          </View>
        </View>

        {/* Units Grid */}
        <View style={styles.unitsGrid}>
          {CURRICULUM.map((unit) => (
            <TouchableOpacity
              key={unit.id}
              style={[styles.unitCard, { backgroundColor: unit.bgColor }]}
              onPress={() => navigation.navigate('LessonsList', { unit })}
              activeOpacity={0.7}
            >
              <View style={styles.unitIconContainer}>
                <Text style={styles.unitIcon}>{unit.icon}</Text>
              </View>
              <View style={styles.unitContent}>
                <Text style={[styles.unitTitle, { color: unit.color }]}>
                  {unit.title}
                </Text>
                <Text style={styles.unitDescription}>
                  {unit.description}
                </Text>
                <View style={styles.unitFooter}>
                  <View style={styles.lessonsCount}>
                    <Icon name="book-open" size={16} color={unit.color} />
                    <Text style={[styles.lessonsCountText, { color: unit.color }]}>
                      {unit.lessonsCount} دروس
                    </Text>
                  </View>
                  <View style={[styles.unitArrow, { backgroundColor: unit.color }]}>
                    <Icon name="chevron-left" size={20} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>تقدمك الدراسي</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>3</Text>
                <Text style={styles.progressStatLabel}>دروس مكتملة</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>8</Text>
                <Text style={styles.progressStatLabel}>إجمالي الدروس</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>38%</Text>
                <Text style={styles.progressStatLabel}>التقدم</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '38%' }]} />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4F46E5',
    marginRight: 8,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  unitsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  unitCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
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
  unitIconContainer: {
    marginLeft: 16,
  },
  unitIcon: {
    fontSize: 48,
  },
  unitContent: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  unitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  unitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonsCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonsCountText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  unitArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'right',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
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
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 6,
  },
});

export default StudentUnitsScreen;