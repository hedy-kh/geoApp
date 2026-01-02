import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LESSONS_DATA } from "../../../utils/lessonsData";
const { width } = Dimensions.get("window");


const CURRICULUM = [
  {
    id: "unit-1",
    title: "المحور الاول :مجال المغرب العربي",
    description: "استكشف جغرافية المغرب العربي",
    lessonsCount: LESSONS_DATA["unit-1"].length,
    icon: "🌍",
  },
  {
    id: "unit-2",
    title: "المحور الثاني: السياحة بالبلاد التونسية",
    description: "تعرف على المناطق السياحية في تونس ",
    lessonsCount: LESSONS_DATA["unit-2"].length,
    icon: "⛱️",
  },
];

const UnitsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.unitsHeader}>
          <Text style={styles.unitsTitle}>اختر المحور الدراسي 📚</Text>
          <Text style={styles.unitsSubtitle}>حدد مسار رحلتك التعليمية</Text>
        </View>

        <View style={styles.unitsGrid}>
          {CURRICULUM.map((unit) => (
            <TouchableOpacity
              key={unit.id}
              style={styles.unitCard}
              onPress={() =>
                navigation.navigate("LessonsList", { unitId: unit.id })
              }
              activeOpacity={0.7}
            >
              <View style={styles.unitIconContainer}>
                <Text style={styles.unitIcon}>{unit.icon}</Text>
              </View>
              <Text style={styles.unitTitle}>{unit.title}</Text>
              <Text style={styles.unitDescription}>{unit.description}</Text>
              <View style={styles.unitFooter}>
                <Text style={styles.lessonsCount}>
                  {unit.lessonsCount} دروس تفاعلية
                </Text>
                <View style={styles.unitArrow}>
                  <Text style={styles.unitArrowText}>دخول المحور </Text>
                </View>
              </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  unitsHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  unitsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "right",
  },
  unitsSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "right",
  },
  unitsGrid: {
    gap: 16,
  },
  unitCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  unitIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  unitIcon: {
    fontSize: 28,
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "right",
  },
  unitDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "right",
    lineHeight: 22,
  },
  unitFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  lessonsCount: {
    fontSize: 12,
    color: "#6B7280",
  },
  unitArrow: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitArrowText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default UnitsScreen;
