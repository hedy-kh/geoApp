import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { VideoView } from "expo-video";
import YoutubePlayer from "react-native-youtube-iframe";
import useVideo from "../../../hooks/useVideo";
import CardSection from "../../../components/reusable/CardSection";
import Exercies from "../../../components/reusable/Exercies";
import StudentAR from "./StudentAR";

const { width, height } = Dimensions.get("window");
const isSmallScreen = width < 375;
const isLargeScreen = width > 414;

const getYouTubeVideoId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
  const match = url.match(regExp);
  return match ? match[2] : null;
};

const FunFactSection = ({ funFactData }) => {
  if (!funFactData) return null;

  return (
    <View style={styles.funFactContainer}>
      <Text style={styles.funFactEmoji}>{funFactData.emoji}</Text>
      <View style={styles.funFactContent}>
        <Text style={styles.funFactLabel}>{funFactData.title}</Text>
        <Text style={styles.funFactText} numberOfLines={4}>
          {funFactData.body}
        </Text>
      </View>
    </View>
  );
};

const LessonDetailScreen = ({ navigation, route }) => {
  const { lesson } = route.params;
  const [completed, setCompleted] = useState(lesson.isCompleted);
  // ---------------- ADD THESE ----------------
  const [showExercises, setShowExercises] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const openExercises = (difficultyId) => {
    setSelectedDifficulty({
      lessonId: lesson.id,
      unitId: route?.params?.unitId,
      level: difficultyId,
    });
    setShowExercises(true);
  };

  const closeExercises = () => {
    setShowExercises(false);
  };

  const isYoutube = lesson.video?.type === "youtube";
  const videoUrl = lesson.video?.url;

  const youtubeVideoId = isYoutube ? getYouTubeVideoId(videoUrl) : null;

  const videoHook = useVideo(!isYoutube ? videoUrl : null, {
    autoplay: false,
    loop: false,
    volume: 0.8,
  });

  const {
    player,
    isLoading,
    error,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
  } = videoHook;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const funFactData = lesson.content?.find((item) => item.type === "fact");

  const renderVideoSection = () => {
    if (isYoutube && youtubeVideoId) {
      return (
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={isSmallScreen ? 180 : isLargeScreen ? 240 : 220}
            play={false}
            videoId={youtubeVideoId}
          />
        </View>
      );
    }

    return (
      <View style={styles.videoContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4F46E5" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : player ? (
          <>
            <VideoView
              style={styles.videoPlayer}
              player={player}
              nativeControls={false}
            />
            <View style={styles.controlsBar}>
              <TouchableOpacity onPress={togglePlay}>
                <Icon
                  name={isPlaying ? "pause" : "play"}
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>

              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>

              <TouchableOpacity onPress={toggleMute}>
                <Icon
                  name={player?.muted ? "volume-mute" : "volume-high"}
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-right" size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.lessonHeader}>
          {completed && (
            <View style={styles.completedBadge}>
              <Icon name="check" size={16} color="#FFF" />
              <Text style={styles.completedText}>مكتمل</Text>
            </View>
          )}

          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonSubtitle}>{lesson.description}</Text>
        </View>

        {renderVideoSection()}

        {/* ================= CARD SECTION ================= */}
        {lesson.content?.find((item) => item.cards) && (
          <CardSection cardData={lesson.content.find((item) => item.cards)} />
        )}
        {/* ================= FUN FACT SECTION ================= */}
        {funFactData && <FunFactSection funFactData={funFactData} />}

        {/* ================= QUIZ SECTION ================= */}
        <View style={styles.quizSection}>
          <Text style={styles.sectionTitle}>🎯 اختبر معرفتك</Text>
          <Text style={styles.quizSubtitle}>اختر مستوى الصعوبة:</Text>

          <View style={styles.difficultyOptions}>
            {[
              { id: "EASY", label: "سهل", icon: "🦁", color: "#10B981" },
              { id: "MEDIUM", label: "متوسط", icon: "🧭", color: "#F59E0B" },
              { id: "HARD", label: "صعب", icon: "⚔️", color: "#DC2626" },
            ].map((diff) => (
              <TouchableOpacity
                key={diff.id}
                style={[
                  styles.difficultyButton,
                  { backgroundColor: diff.color },
                ]}
                activeOpacity={0.8}
                onPress={() => openExercises(diff.id)}
              >
                <Text style={styles.difficultyIcon}>{diff.icon}</Text>
                <Text style={styles.difficultyLabel}>{diff.label}</Text>
              </TouchableOpacity>
            ))}
            {showExercises && (
              <Exercies details={selectedDifficulty} onClose={closeExercises} />
            )}
          </View>
        </View>

        {/* ================= AR TOOLS ================= */}
        <StudentAR arViewId={lesson.arId} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  scrollContent: {
    paddingHorizontal: isSmallScreen ? 0 : 8,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
  },
  lessonHeader: {
    marginBottom: 16,
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  completedBadge: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: "flex-end",
  },
  completedText: {
    color: "#FFF",
    fontSize: 12,
    marginRight: 4,
  },
  lessonTitle: {
    fontSize: isSmallScreen ? 20 : isLargeScreen ? 26 : 24,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontSize: isSmallScreen ? 14 : 15,
    color: "#6B7280",
    textAlign: "right",
    lineHeight: 22,
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: "#080101ff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 16,
    width: width - 32,
    alignSelf: "center",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  errorText: {
    color: "#FECACA",
    textAlign: "center",
    padding: 20,
  },
  controlsBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  funFactContainer: {
    backgroundColor: "#fef9c3",
    padding: isSmallScreen ? 20 : 24,
    borderRadius: isSmallScreen ? 24 : 28,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#fde047",
    flexDirection: "row",
    alignItems: "center",
    gap: isSmallScreen ? 16 : 20,
    marginHorizontal: isSmallScreen ? 12 : 16,
    marginBottom: 16,
    minHeight: isSmallScreen ? 100 : 120,
  },
  funFactEmoji: {
    fontSize: isSmallScreen ? 40 : isLargeScreen ? 50 : 44,
  },
  funFactContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  funFactLabel: {
    fontSize: isSmallScreen ? 12 : 13,
    fontWeight: "bold",
    color: "#ca8a04",
    textTransform: "uppercase",
    marginBottom: 6,
    textAlign: "right",
  },
  funFactText: {
    fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
    fontWeight: "900",
    color: "#713f12",
    lineHeight: isSmallScreen ? 22 : 24,
    textAlign: "right",
  },
  timeText: {
    color: "#FFF",
    fontSize: 14,
  },
  quizSection: {
    marginBottom: 20,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 17 : 18,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 8,
  },
  quizSubtitle: {
    fontSize: isSmallScreen ? 14 : 15,
    textAlign: "right",
    color: "#6B7280",
    marginBottom: 16,
  },
  difficultyOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: isSmallScreen ? 12 : 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: isSmallScreen ? 70 : 80,
  },
  difficultyLabel: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: isSmallScreen ? 14 : 16,
    marginTop: 6,
  },
  difficultyIcon: {
    fontSize: isSmallScreen ? 24 : 26,
  },
});

export default LessonDetailScreen;
