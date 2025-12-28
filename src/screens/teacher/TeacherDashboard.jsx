import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  Alert,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('lessons');
  const navigation = useNavigation();
  const curriculum = [
    {
      id: 'unit-1',
      title: 'المغرب العربي: الموقع والمساحة',
      lessons: [
        {
          id: 'lesson-1',
          title: 'تعريف المغرب العربي',
          description: 'التعريف بالمغرب العربي وموقعها الجغرافي',
          thumbnailUrl: 'data:image/jpeg;base64,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',
          types: ['فيديو', 'صور', 'خريطة']
        },
        {
          id: 'lesson-2',
          title: 'حدود المغرب العربي',
          description: 'الحدود البرية والبحرية لدول المغرب العربي',
          thumbnailUrl: 'data:image/jpeg;base64,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',
          types: ['فيديو', 'خريطة']
        }
      ]
    }
  ];

  const pdfResources = [
    { title: 'كتاب المعلم - الجغرافيا', size: '4.2 MB', type: 'PDF' },
    { title: 'مجموعة خرائط صماء', size: '12.5 MB', type: 'ZIP' },
    { title: 'دليل الوسائل التعليمية', size: '2.1 MB', type: 'PDF' },
    { title: 'كراس التمارين', size: '3.8 MB', type: 'PDF' },
  ];

  const examTemplates = [
    { title: 'تقييم مكتسبات', duration: '45 دقيقة', level: 'متوسط' },
    { title: 'امتحان الثلاثي الأول', duration: '60 دقيقة', level: 'شامل' },
    { title: 'تمرين منزلي', duration: '20 دقيقة', level: 'دعم' },
  ];

 const renderLessonsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <Text style={styles.headerCardTitle}>الدروس الجاهزة للعرض</Text>
        <Text style={styles.headerCardSubtitle}>اختر درساً لعرضه مباشرة على السبورة التفاعلية</Text>
      </View>

      <View style={styles.lessonsContainer}>
        {curriculum[0].lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonCard}
            onPress={() => Alert.alert('عرض الدرس', `بدء عرض درس: ${lesson.title}`)}
          >
            <Image
              source={{ uri: lesson.thumbnailUrl }}
              style={styles.lessonImage}
              resizeMode="cover"
            />
            <View style={styles.lessonContent}>
              <View style={styles.lessonHeader}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <TouchableOpacity style={styles.playButton}>
                  <Icon name="play-circle" size={30} color="#3B82F6" />
                </TouchableOpacity>
              </View>
              <Text style={styles.lessonDescription}>{lesson.description}</Text>
              <View style={styles.lessonTags}>
                {lesson.types.map((type, index) => (
                  <View key={index} style={[
                    styles.tag,
                    type === 'فيديو' && styles.videoTag,
                    type === 'صور' && styles.imageTag,
                    type === 'خريطة' && styles.mapTag
                  ]}>
                    <Text style={[
                      styles.tagText,
                      type === 'فيديو' && styles.videoTagText,
                      type === 'صور' && styles.imageTagText,
                      type === 'خريطة' && styles.mapTagText
                    ]}>
                      {type}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderPdfTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <Text style={styles.headerCardTitle}>مكتبة المذكرات والخرائط</Text>
        <Text style={styles.headerCardSubtitle}>تحميل المذكرات البيداغوجية والوسائل التعليمية</Text>
      </View>

      <View style={styles.pdfContainer}>
        {pdfResources.map((resource, index) => (
          <View key={index} style={styles.pdfCard}>
            <View style={styles.pdfIconContainer}>
              <Icon name="file-pdf-box" size={40} color="#DC2626" />
            </View>
            <View style={styles.pdfContent}>
              <Text style={styles.pdfTitle} numberOfLines={2}>{resource.title}</Text>
              <View style={styles.pdfMeta}>
                <Text style={styles.pdfSize}>{resource.size}</Text>
                <View style={styles.pdfTypeBadge}>
                  <Text style={styles.pdfTypeText}>{resource.type}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.downloadButton}>
              <Icon name="download" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderExamsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <Text style={styles.headerCardTitle}>بنك الاختبارات والتمارين</Text>
        <Text style={styles.headerCardSubtitle}>مجموعة من الاختبارات الجاهزة لتقييم المكتسبات</Text>
      </View>

      <View style={styles.examsContainer}>
        {examTemplates.map((exam, index) => (
          <View key={index} style={styles.examCard}>
            <View style={styles.examIcon}>
              <Icon name="file-document" size={40} color="#3B82F6" />
            </View>
            <View style={styles.examContent}>
              <Text style={styles.examTitle}>{exam.title}</Text>
              <View style={styles.examMeta}>
                <View style={styles.examMetaItem}>
                  <Icon name="clock-outline" size={16} color="#6B7280" />
                  <Text style={styles.examDuration}>{exam.duration}</Text>
                </View>
                <View style={styles.examLevelBadge}>
                  <Text style={styles.examLevelText}>{exam.level}</Text>
                </View>
              </View>
            </View>
            <View style={styles.examActions}>
              <TouchableOpacity style={styles.printButton}>
                <Icon name="printer" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton}>
                <Icon name="pencil" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAiTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.aiHeaderCard}>
        <View style={styles.aiIconCircle}>
          <Icon name="robot" size={50} color="#FFFFFF" />
        </View>
        <Text style={styles.aiTitle}>المساعد الذكي</Text>
        <Text style={styles.aiSubtitle}>دع Gemini يساعدك في ابتكار أسئلة جديدة لدرسك الحالي</Text>
      </View>

      <View style={styles.aiContent}>
        <View style={styles.aiForm}>
          <Text style={styles.formLabel}>اختر الدرس المراد تلخيصه</Text>
          <View style={styles.selectContainer}>
            <Text style={styles.selectText}>تعريف المغرب العربي</Text>
            <Icon name="chevron-down" size={24} color="#6B7280" />
          </View>

          <TouchableOpacity style={styles.aiPrimaryButton}>
            <Icon name="lightbulb-on" size={24} color="#FFFFFF" />
            <Text style={styles.aiPrimaryButtonText}>إنتاج 5 أسئلة اختيار من متعدد</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aiSecondaryButton}>
            <Icon name="book-open-variant" size={24} color="#3B82F6" />
            <Text style={styles.aiSecondaryButtonText}>تلخيص الدرس بأسلوب القصة</Text>
          </TouchableOpacity>

          <Text style={styles.aiNote}>سيتم إنشاء محتوى حصري بناءً على منهج الوزارة</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Main Header - Now using navigation.toggleDrawer() */}
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu" size={28} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>حقيبة المعلم</Text>
          <Text style={styles.headerSubtitle}>موارد الجغرافيا الرقمية</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell" size={24} color="#4F46E5" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {activeTab === 'lessons' && renderLessonsTab()}
        {activeTab === 'pdf' && renderPdfTab()}
        {activeTab === 'exams' && renderExamsTab()}
        {activeTab === 'ai' && renderAiTab()}
      </View>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTab}>
        {[
          { id: 'lessons', label: 'دروس', icon: 'television-play' },
          { id: 'pdf', label: 'مكتبة', icon: 'book-open-variant' },
          { id: 'exams', label: 'اختبارات', icon: 'file-document' },
          { id: 'ai', label: 'ذكي', icon: 'robot' }
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.tabItem}
            onPress={() => setActiveTab(item.id)}
          >
            <Icon
              name={item.icon}
              size={24}
              color={activeTab === item.id ? '#3B82F6' : '#9CA3AF'}
            />
            <Text style={[
              styles.tabLabel,
              activeTab === item.id && styles.tabLabelActive
            ]}>
              {item.label}
            </Text>
            {activeTab === item.id && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  mainContent: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  lessonsContainer: {
    gap: 16,
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  lessonImage: {
    width: '100%',
    height: 160,
  },
  lessonContent: {
    padding: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  playButton: {
    padding: 8,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  lessonTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  videoTag: {
    backgroundColor: '#DBEAFE',
  },
  imageTag: {
    backgroundColor: '#D1FAE5',
  },
  mapTag: {
    backgroundColor: '#EDE9FE',
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoTagText: {
    color: '#1E40AF',
  },
  imageTagText: {
    color: '#065F46',
  },
  mapTagText: {
    color: '#5B21B6',
  },
  pdfContainer: {
    gap: 12,
  },
  pdfCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pdfIconContainer: {
    marginRight: 16,
  },
  pdfContent: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  pdfMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pdfSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  pdfTypeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pdfTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  downloadButton: {
    padding: 8,
  },
  examsContainer: {
    gap: 12,
  },
  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  examIcon: {
    marginRight: 16,
  },
  examContent: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  examMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  examMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  examDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  examLevelBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  examLevelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  examActions: {
    flexDirection: 'row',
    gap: 8,
  },
  printButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 10,
  },
  aiHeaderCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  aiIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  aiSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  aiContent: {
    paddingHorizontal: 8,
  },
  aiForm: {
    gap: 20,
  },
  formLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  selectContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  aiPrimaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  aiPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  aiSecondaryButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  aiSecondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  aiNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bottomTab: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 30,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 1.5,
  },
});

export default TeacherDashboard;