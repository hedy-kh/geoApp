import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LESSONS_DATA } from '../../../utils/lessonsData';
const { width } = Dimensions.get('window');
const LessonsListScreen = ({ navigation, route }) => {
  const { unitId } = route.params;
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    setLessons(LESSONS_DATA[unitId] || []);
  }, [unitId]);


  const handleLessonPress = (lesson) => {
    navigation.navigate('LessonDetail', { lesson });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-right" size={24} color="#4F46E5" />
          <Text style={styles.backButtonText}>رجوع</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.lessonsHeader}>
          <Text style={styles.lessonsHeaderTitle}>دروس المحور</Text>
          <Text style={styles.lessonsHeaderSubtitle}>
            {lessons.length} درس متاح
          </Text>
        </View>

        <View style={styles.lessonsList}>
          {lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => handleLessonPress(lesson)}
              activeOpacity={0.7}
            >
              <View style={styles.lessonCardHeader}>
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.lessonCardInfo}>
                  <Text style={styles.lessonCardTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonCardDescription} numberOfLines={2}>
                    {lesson.description}
                  </Text>
                  <Text style={styles.lessonDuration}>⏱️ {lesson.duration}</Text>
                </View>
                {lesson.isCompleted && (
                  <Icon name="check-circle" size={24} color="#10B981" />
                )}
              </View>
              <TouchableOpacity 
                style={styles.startLessonButton}
                onPress={() => handleLessonPress(lesson)}
              >
                <Text style={styles.startLessonText}>بدء الدرس </Text>
                <Icon name="play" size={16} color="#FFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  backButtonText: {
    fontSize: 16,
    color: "#4F46E5",
    marginRight: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  lessonsHeader: {
    marginBottom: 24,
  },
  lessonsHeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "right",
  },
  lessonsHeaderSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "right",
  },
  lessonsList: {
    gap: 12,
  },
  lessonCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  lessonCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  lessonNumber: {
    width: 36,
    height: 36,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  lessonNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  lessonCardInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  lessonCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "right",
    marginBottom: 6,
  },
  lessonCardDescription: {
    textAlign: "right",
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  lessonDuration: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  startLessonButton: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  startLessonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 8,
  },
});

export default LessonsListScreen;