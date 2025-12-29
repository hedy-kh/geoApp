import React, { useState, useEffect, useRef } from "react";
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
import useVideo from "../../../hooks/useVideo";

const { width } = Dimensions.get("window");

const LessonDetailScreen = ({ navigation, route }) => {
  const { lesson } = route.params;
  const [completed, setCompleted] = useState(lesson.isCompleted);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef(null);

  // Use a direct video URL (YouTube URLs need special handling)
  const directVideoUrl = "https://www.youtube.com/watch?v=eehXRw6Oqxw";

  const videoHook = useVideo(directVideoUrl, {
    autoplay: false,
    loop: false,
    volume: 0.8,
    allowsFullscreen: true,
    allowsPictureInPicture: true,
  });

  const {
    player,
    isLoading,
    error,
    isPlaying,
    currentTime,
    duration,
    initializePlayer,
    togglePlay,
    stop,
    toggleMute,
    seekTo,
  } = videoHook;

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        await initializePlayer();
      } catch (err) {
        console.error("Video initialization error:", err);
      }
    };

    initializeVideo();

    return () => {
      if (videoHook && typeof videoHook.unload === "function") {
        videoHook.unload();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-hide controls after 3 seconds when playing
    if (showControls && isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const onQuizComplete = (score) => {
    if (score >= 50 && !completed) {
      setCompleted(true);
    }
    Alert.alert(
      "نتيجة الاختبار",
      `نهائك: ${score}/100\n${
        score >= 50 ? "مبروك! أكملت الدرس 🎉" : "حاول مرة أخرى 💪"
      }`,
      [{ text: "حسناً" }]
    );
  };

  const toggleVideoPlayback = () => {
    if (player) {
      togglePlay();
      setShowControls(true);
    }
  };

  const handleVideoPress = () => {
    if (isLoading || error) return;

    setShowControls(true);
    if (!isPlaying) {
      toggleVideoPlayback();
    } else {
      // Just show controls on tap when playing
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(
        () => setShowControls(false),
        3000
      );
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderVideoSection = () => (
    <View style={styles.videoContainer}>
      {isLoading ? (
        <View style={styles.videoPlaceholder}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.videoPlaceholderText}>جاري تحميل الفيديو...</Text>
        </View>
      ) : error ? (
        <View style={styles.videoPlaceholder}>
          <Icon name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              initializePlayer().catch((err) => {
                console.error("Retry failed:", err);
              });
            }}
          >
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : player ? (
        <>
          <VideoView
            style={styles.videoPlayer}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />

          {/* Video Overlay Controls */}
          <TouchableOpacity
            style={styles.videoOverlay}
            onPress={handleVideoPress}
            activeOpacity={0.8}
          >
            {!isPlaying && !isLoading && !error && (
              <View style={styles.playButtonOverlay}>
                <Icon name="play-circle" size={60} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          {/* Video Controls Bar */}
          {showControls && !isLoading && !error && (
            <View style={styles.controlsBar}>
              <TouchableOpacity
                onPress={toggleVideoPlayback}
                disabled={isLoading || !!error}
              >
                <Icon
                  name={isPlaying ? "pause" : "play"}
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>

              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>

              <TouchableOpacity
                onPress={toggleMute}
                disabled={isLoading || !!error}
              >
                <Icon
                  name={player?.muted ? "volume-mute" : "volume-high"}
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.videoPlaceholder}>
          <Icon name="video-off" size={48} color="#6B7280" />
          <Text style={styles.videoPlaceholderText}>الفيديو غير متوفر</Text>
        </View>
      )}
    </View>
  );

  const renderQuizSection = () => (
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
            style={[styles.difficultyButton, { backgroundColor: diff.color }]}
            onPress={() => onQuizComplete(Math.floor(Math.random() * 100))}
            activeOpacity={0.8}
          >
            <Text style={styles.difficultyIcon}>{diff.icon}</Text>
            <Text style={styles.difficultyLabel}>{diff.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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

        {/* Video Section */}
        {renderVideoSection()}

        {/* Content */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>📖 المحتوى التعليمي</Text>
          <Text style={styles.lessonContent}>
            المغرب العربي منطقة في شمال أفريقيا تضم خمس دول: المغرب، الجزائر،
            تونس، ليبيا، موريتانيا. تطل على البحر الأبيض المتوسط من الشمال
            والمحيط الأطلسي من الغرب. تمتاز بتنوع جغرافي كبير من الجبال إلى
            الصحاري.
          </Text>
        </View>

        {/* Fun Fact */}
        <View style={styles.funFactCard}>
          <Text style={styles.funFactIcon}>😲</Text>
          <View style={styles.funFactContent}>
            <Text style={styles.funFactLabel}>هل تعلم؟</Text>
            <Text style={styles.funFactText}>
              المغرب العربي يضم أكبر صحراء حارة في العالم!
            </Text>
          </View>
        </View>

        {/* Quiz Section */}
        {renderQuizSection()}

        {/* Interactive Tools */}
        <View style={styles.toolsSection}>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>🕶️</Text>
            <Text style={styles.toolText}>جولة 360°</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toolButton, styles.toolButtonAR]}>
            <Text style={styles.toolIcon}>📸</Text>
            <Text style={styles.toolText}>تجربة AR</Text>
          </TouchableOpacity>
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
  lessonHeader: {
    marginBottom: 20,
    alignItems: "flex-end",
  },
  completedBadge: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  completedText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "600",
    marginRight: 4,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "right",
  },
  lessonSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "right",
    lineHeight: 24,
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: 20,
  },
  videoPlaceholderText: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10,
  },
  controlsBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#FECACA",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  contentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "right",
  },
  lessonContent: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 26,
    textAlign: "right",
  },
  funFactCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  funFactIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  funFactContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  funFactLabel: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "bold",
    marginBottom: 4,
  },
  funFactText: {
    fontSize: 16,
    color: "#92400E",
    fontWeight: "600",
  },
  quizSection: {
    marginBottom: 20,
  },
  quizSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "right",
  },
  difficultyOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  difficultyButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  difficultyIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  difficultyLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  toolsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  toolButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  toolButtonAR: {
    backgroundColor: "#059669",
  },
  toolIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  toolText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default LessonDetailScreen;
