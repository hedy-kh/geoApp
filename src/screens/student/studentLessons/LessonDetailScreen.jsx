import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { VideoView } from "expo-video";
import YoutubePlayer from "react-native-youtube-iframe";
import useVideo from "../../../hooks/useVideo";
import StudentAR from "./StudentAR";

const { width } = Dimensions.get("window");

const getYouTubeVideoId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
  const match = url.match(regExp);
  return match ? match[2] : null;
};

const LessonDetailScreen = ({ navigation, route }) => {
  const { lesson } = route.params;
  const [completed, setCompleted] = useState(lesson.isCompleted);

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

  // ================= VIDEO RENDER =================
  const renderVideoSection = () => {
    if (isYoutube && youtubeVideoId) {
      return (
        <View style={styles.videoContainer}>
          <YoutubePlayer height={220} play={false} videoId={youtubeVideoId} />
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

  // ================= UI =================
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-right" size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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

        {/* 🔥 THIS IS WHERE lesson.content GOES 🔥 */}
        {lesson.content?.map((block, index) => {
          if (block.type === "text") {
            return (
              <View key={index} style={styles.contentSection}>
                <Text style={styles.sectionTitle}>{block.title}</Text>
                <Text style={styles.lessonContent}>{block.body}</Text>
              </View>
            );
          }

          if (block.type === "fact") {
            return (
              <View key={index} style={styles.funFactCard}>
                <Text style={styles.funFactIcon}>{block.emoji}</Text>
                <View style={styles.funFactContent}>
                  <Text style={styles.funFactLabel}>{block.title}</Text>
                  <Text style={styles.funFactText}>{block.body}</Text>
                </View>
              </View>
            );
          }

          return null;
        })}

        {/* QUIZ */}
        <View style={styles.quizSection}>
          <Text style={styles.sectionTitle}>🎯 اختبر معرفتك</Text>

          <View style={styles.difficultyOptions}>
            {["سهل", "متوسط", "صعب"].map((label, i) => (
              <TouchableOpacity key={i} style={styles.difficultyButton}>
                <Text style={styles.difficultyLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* <View style={styles.quizSection}>
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
              >
                <Text style={styles.difficultyIcon}>{diff.icon}</Text>
                <Text style={styles.difficultyLabel}>{diff.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* ================= TOOLS ================= */}
        <StudentAR arViewId={lesson.arId} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF", paddingHorizontal: 10 },
  header: { paddingHorizontal: 16, paddingTop: 10 },
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
  scrollView: { paddingHorizontal: 16 },
  lessonHeader: { marginBottom: 20, alignItems: "flex-end" },
  completedBadge: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  completedText: {
    color: "#FFF",
    fontSize: 12,
    marginRight: 4,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
  },
  lessonSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "right",
  },
  videoContainer: {
    aspectRatio: 16 / 10,
    backgroundColor: "#080101ff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    width: "100%", 
    alignSelf: "center",
  },
  videoPlayer: { width: "100%", height: "100%" },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholderText: { color: "#FFF", marginTop: 8 },
  errorText: { color: "#FECACA" },
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
  timeText: { color: "#FFF" },
  contentSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", textAlign: "right" },
  lessonContent: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: "right",
  },
  funFactCard: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 20,
  },
  funFactIcon: { fontSize: 32, marginRight: 12 },
  funFactContent: { flex: 1, alignItems: "flex-end" },
  funFactLabel: { fontSize: 12, fontWeight: "bold" },
  funFactText: { fontSize: 16, fontWeight: "600" },
  quizSection: { marginBottom: 20 },
  quizSubtitle: { fontSize: 16, textAlign: "right" },
  difficultyOptions: { flexDirection: "row" },
  difficultyButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  difficultyLabel: { color: "#FFF", fontWeight: "bold" },
});

export default LessonDetailScreen;
