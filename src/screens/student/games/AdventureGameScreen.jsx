import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AdventureQuizz, getQuizForLevel } from "../../../utils/AdventureQuizz";
import useSound from "../../../hooks/useSound";
import ProgressBar from "react-native-progress/Bar";

const { width, height } = Dimensions.get("window");

const AdventureGameScreen = ({ navigation }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [levelProgress, setLevelProgress] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { correctAnswerSound, wrongAnswerSound } = useSound();

  const levels = [
    {
      id: 1,
      name: "مبتدئ",
      icon: "🐣",
      completed: true,
      color: "#F59E0B",
      bgColor: "#FEF3C7",
    },
    {
      id: 2,
      name: "سهل",
      icon: "🧭",
      completed: false,
      color: "#10B981",
      bgColor: "#D1FAE5",
    },
    {
      id: 3,
      name: "متوسط",
      icon: "🗺️",
      completed: false,
      color: "#3B82F6",
      bgColor: "#DBEAFE",
    },
    {
      id: 4,
      name: "متقدم",
      icon: "🏔️",
      completed: false,
      color: "#8B5CF6",
      bgColor: "#EDE9FE",
    },
  ];

  useEffect(() => {
    const questions = getQuizForLevel(currentLevel);
    setQuizQuestions(questions);
  }, [currentLevel]);

  const handleLevelSelect = (level) => {
    if (level.completed || level.id === currentLevel) {
      Alert.alert(
        `مستوى ${level.name}`,
        `اختبر معلوماتك الجغرافية عن ${level.name}\n\nستحصل على 25 نقطة لكل إجابة صحيحة!`,
        [
          { text: "لاحقاً", style: "cancel" },
          {
            text: "بدأ الاختبار",
            onPress: () => {
              if (quizQuestions.length > 0) {
                startQuiz(level);
              } else {
                Alert.alert(
                  "لا يوجد أسئلة",
                  "سيتم إضافة أسئلة قريباً لهذا المستوى"
                );
              }
            },
          },
        ]
      );
    } else {
      Alert.alert("مستوى مقفل", "يجب إكمال المستوى السابق أولاً");
    }
  };

  const startQuiz = (level) => {
    if (playerEnergy < 20) {
      Alert.alert("طاقة غير كافية", "أنت بحاجة إلى 20 طاقة للعب. ارجع لاحقاً!");
      return;
    }

    setPlayerEnergy((prev) => Math.max(prev - 20, 0));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setLevelProgress(0);
    setQuizModalVisible(true);
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    const isCorrect =
      answer === quizQuestions[currentQuestionIndex].correctAnswer;

    if (isCorrect) {
      correctAnswerSound();
      setScore((prev) => prev + 10);
      setCoins((prev) => prev + 25);
      setLevelProgress((prev) => prev + 1 / quizQuestions.length);
    } else {
      wrongAnswerSound();
    }

    setShowResult(true);

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
        // Check if level should be completed
        if (levelProgress + 1 / quizQuestions.length >= 0.8) {
          completeLevel();
        }
      }
    }, 3500);
  };

  const completeLevel = () => {
    const updatedLevels = [...levels];
    if (currentLevel < updatedLevels.length) {
      updatedLevels[currentLevel].completed = true;
      setCurrentLevel((prev) => prev + 1);
    }

    Alert.alert(
      "تهانينا! 🎉",
      `أكملت المستوى بنجاح! لقد ربحت 100 نقطة إضافية!`,
      [{ text: "ممتاز!", onPress: () => setQuizModalVisible(false) }]
    );

    setCoins((prev) => prev + 100);
    setScore((prev) => prev + 50);
    setPlayerEnergy((prev) => Math.min(prev + 30, 100));
  };

  const collectCoin = () => {
    if (playerEnergy >= 10) {
      setCoins((prev) => prev + 10);
      setPlayerEnergy((prev) => prev - 10);
      correctAnswerSound();
    } else {
      Alert.alert("طاقة غير كافية", "أنت بحاجة إلى طاقة لجمع العملات");
    }
  };

  const renderQuizModal = () => {
    if (!quizQuestions.length || !quizQuestions[currentQuestionIndex])
      return null;

    const currentQ = quizQuestions[currentQuestionIndex];

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={quizModalVisible}
        onRequestClose={() => setQuizModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>اختبار جغرافي</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setQuizModalVisible(false)}
                >
                  <Icon name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <ProgressBar
                progress={levelProgress}
                width={width - 48}
                height={6}
                color="#10B981"
                style={styles.progressBar}
                borderRadius={3}
              />

              <View style={styles.questionCounter}>
                <Text style={styles.counterText}>
                  سؤال {currentQuestionIndex + 1} من {quizQuestions.length}
                </Text>
              </View>

              {currentQ.image && (
                <View style={styles.questionImageContainer}>
                  <Image
                    source={currentQ.image}
                    style={styles.questionImage}
                    resizeMode="contain"
                  />
                </View>
              )}

              <ScrollView
                style={styles.questionScrollView}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.questionText}>{currentQ.question}</Text>

                <View style={styles.optionsContainer}>
                  {currentQ.options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        selectedAnswer === option && styles.optionSelected,
                        showResult &&
                          option === currentQ.correctAnswer &&
                          styles.optionCorrect,
                        showResult &&
                          selectedAnswer === option &&
                          selectedAnswer !== currentQ.correctAnswer &&
                          styles.optionWrong,
                      ]}
                      onPress={() => handleAnswerSelect(option)}
                      disabled={showResult}
                    >
                      <View style={styles.optionContent}>
                        <Text style={styles.optionText}>{option}</Text>
                        {showResult && option === currentQ.correctAnswer && (
                          <Icon name="check-circle" size={20} color="#10B981" />
                        )}
                        {showResult &&
                          selectedAnswer === option &&
                          selectedAnswer !== currentQ.correctAnswer && (
                            <Icon
                              name="close-circle"
                              size={20}
                              color="#EF4444"
                            />
                          )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {showResult && (
                  <View style={styles.resultContainer}>
                    <Text
                      style={[
                        styles.resultText,
                        selectedAnswer === currentQ.correctAnswer
                          ? styles.correctText
                          : styles.wrongText,
                      ]}
                    >
                      {selectedAnswer === currentQ.correctAnswer
                        ? "إجابة صحيحة! 🎉"
                        : "إجابة خاطئة ❌"}
                    </Text>
                    <Text style={styles.explanationText}>
                      {currentQ.explanation}
                    </Text>
                  </View>
                )}

                {quizCompleted && (
                  <View style={styles.completionContainer}>
                    <Text style={styles.completionTitle}>
                      🎊 أكملت الاختبار!
                    </Text>
                    <Text style={styles.completionText}>
                      لقد ربحت {coins} نقطة و {score} درجة
                    </Text>
                    <TouchableOpacity
                      style={styles.continueButton}
                      onPress={() => setQuizModalVisible(false)}
                    >
                      <Text style={styles.continueButtonText}>
                        متابعة المغامرة
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-right" size={24} color="#374151" />
          <Text style={styles.backText}>رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>المستكشف الجغرافي</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="lightning-bolt" size={16} color="#F59E0B" />
            <Text style={styles.statText}>{playerEnergy}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="cash" size={16} color="#F59E0B" />
            <Text style={styles.statText}>{coins}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>🧭</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lv. {currentLevel}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>مرحباً أيها المستكشف!</Text>
          <Text style={styles.heroSubtitle}>
            اختبر معلوماتك الجغرافية عن الوطن العربي. اربح النقاط وتقدم في
            المستويات!
          </Text>
        </View>

        <View style={styles.gameStats}>
          <View style={[styles.statCard, { backgroundColor: "#F0F9FF" }]}>
            <View style={styles.statIconContainer}>
              <Icon name="trophy" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.statLabel}>المستوى</Text>
            <Text style={styles.statValue}>{currentLevel}/4</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#F0FDF4" }]}>
            <View style={styles.statIconContainer}>
              <Icon name="star" size={24} color="#10B981" />
            </View>
            <Text style={styles.statLabel}>النقاط</Text>
            <Text style={styles.statValue}>{coins}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#FEF3C7" }]}>
            <View style={styles.statIconContainer}>
              <Icon name="battery" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statLabel}>الطاقة</Text>
            <View style={styles.energyContainer}>
              <ProgressBar
                progress={playerEnergy / 100}
                width={60}
                height={8}
                color={
                  playerEnergy > 50
                    ? "#10B981"
                    : playerEnergy > 20
                    ? "#F59E0B"
                    : "#EF4444"
                }
              />
              <Text style={styles.energyText}>{playerEnergy}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.levelsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>المستويات الجغرافية</Text>
            <Icon name="map" size={24} color="#10B981" />
          </View>
          <Text style={styles.sectionSubtitle}>
            تقدم عبر المستويات لاكتشاف المناطق المختلفة
          </Text>

          <View style={styles.levelsContainer}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelCard,
                  { borderColor: level.color, backgroundColor: level.bgColor },
                  level.id === currentLevel && styles.levelCardActive,
                  level.completed && styles.levelCardCompleted,
                ]}
                onPress={() => handleLevelSelect(level)}
              >
                <View style={styles.levelHeader}>
                  <View style={styles.levelIconContainer}>
                    <Text style={styles.levelIcon}>{level.icon}</Text>
                  </View>
                  <View style={styles.levelStatusContainer}>
                    {level.completed && (
                      <View style={styles.completedBadge}>
                        <Icon name="check-circle" size={16} color="#10B981" />
                        <Text style={styles.completedText}>مكتمل</Text>
                      </View>
                    )}
                    {level.id === currentLevel && !level.completed && (
                      <View style={styles.activeBadge}>
                        <Icon name="play-circle" size={16} color="#3B82F6" />
                        <Text style={styles.activeText}>قيد اللعب</Text>
                      </View>
                    )}
                    {level.id > currentLevel && (
                      <View style={styles.lockedBadge}>
                        <Icon name="lock" size={16} color="#6B7280" />
                        <Text style={styles.lockedText}>مقفل</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.levelName}>{level.name}</Text>
                <View style={styles.levelInfo}>
                  <View style={styles.rewardContainer}>
                    <Icon name="star" size={14} color="#F59E0B" />
                    <Text style={styles.rewardText}>+{level.id * 25} نقطة</Text>
                  </View>
                  <View style={styles.questionCount}>
                    <Icon name="help-circle" size={14} color="#6B7280" />
                    <Text style={styles.questionCountText}>3 أسئلة</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.playButton, { backgroundColor: level.color }]}
                  onPress={() => handleLevelSelect(level)}
                >
                  <Icon name="play" size={16} color="#FFFFFF" />
                  <Text style={styles.playButtonText}>العب الآن</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.collectButton]}
            onPress={collectCoin}
            disabled={playerEnergy < 10}
          >
            <Icon name="treasure-chest" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>جمع العملات</Text>
            <Text style={styles.actionButtonSubtext}>-10 طاقة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.learnButton]}
            onPress={() => navigation.navigate("GeographyFacts")}
          >
            <Icon name="book-open-variant" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>تعلم الجغرافيا</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.startJourneyButton}
          onPress={() => {
            const currentLevelData = levels.find((l) => l.id === currentLevel);
            if (currentLevelData) {
              startQuiz(currentLevelData);
            }
          }}
          disabled={playerEnergy < 20}
        >
          <Icon name="map-marker-path" size={24} color="#FFFFFF" />
          <Text style={styles.startJourneyText}>ابدأ الاختبار</Text>
          <Text style={styles.startJourneySubtext}>تستهلك 20 طاقة</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderQuizModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
    backgroundImage: "linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 14,
    color: "#374151",
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E40AF",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  statText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexGrow: 1,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    backgroundColor: "#FFFFFF",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 4,
    borderColor: "#3B82F6",
    position: "relative",
  },
  avatarIcon: {
    fontSize: 60,
  },
  levelBadge: {
    position: "absolute",
    bottom: -8,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  levelBadgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "90%",
  },
  gameStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  energyContainer: {
    alignItems: "center",
  },
  energyText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  levelsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "right",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "right",
  },
  levelsContainer: {
    gap: 16,
  },
  levelCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  levelCardActive: {
    transform: [{ scale: 1.02 }],
    shadowColor: "#3B82F6",
    shadowOpacity: 0.15,
  },
  levelCardCompleted: {
    borderStyle: "dashed",
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  levelIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  levelIcon: {
    fontSize: 32,
  },
  levelName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 12,
    textAlign: "right",
  },
  levelInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "600",
  },
  questionCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  questionCountText: {
    fontSize: 12,
    color: "#6B7280",
  },
  levelStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: "#065F46",
    fontWeight: "600",
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  activeText: {
    fontSize: 12,
    color: "#1E40AF",
    fontWeight: "600",
  },
  lockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  lockedText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  collectButton: {
    backgroundColor: "#F59E0B",
  },
  learnButton: {
    backgroundColor: "#8B5CF6",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  startJourneyButton: {
    backgroundColor: "#10B981",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 20,
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startJourneyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  startJourneySubtext: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "95%",
    maxHeight: height * 0.92,
    minHeight: height * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  progressBar: {
    marginHorizontal: 9,
    marginTop: 16,
    marginBottom: 12,
  },
  questionCounter: {
    alignItems: "center",
    marginBottom: 16,
  },
  counterText: {
    fontSize: 14,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  questionImageContainer: {
    height: 160,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  questionImage: {
    width: "100%",
    height: "100%",
  },
  questionImageContainer: {
    height: 160,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 28,
    paddingHorizontal: 8,
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    minHeight: 30,
    justifyContent: "center",
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
    textAlign: "right",
    lineHeight: 24,
    paddingRight: 8,
  },
  optionSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  optionCorrect: {
    borderColor: "#10B981",
    backgroundColor: "#D1FAE5",
  },
  optionWrong: {
    borderColor: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  resultContainer: {
    padding: 14,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  correctText: {
    color: "#10B981",
  },
  wrongText: {
    color: "#EF4444",
  },
  explanationText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  completionContainer: {
    padding: 20,
    backgroundColor: "#F0F9FF",
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  completionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default AdventureGameScreen;
