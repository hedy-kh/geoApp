import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  memoryCards,
  shuffleCards,
  getCategories,
  getCardsByCategory,
  getCardsByDifficulty,
} from "../../../utils/memoryCards";
import useSound from "../../../hooks/useSound";

const { width } = Dimensions.get("window");

const MemoryGameScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameTimer, setGameTimer] = useState(null);
  const [lives, setLives] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories] = useState(getCategories());
  const [difficulty, setDifficulty] = useState("easy");
  const [flipAnimations, setFlipAnimations] = useState({});
  const [showAllCards, setShowAllCards] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});
  const showAllCardsTimer = useRef(null);

  const { correctAnswerSound, wrongAnswerSound, flipSound, winSound } =
    useSound();

  const difficultySettings = {
    easy: { pairs: 4, timeBonus: 30, gridColumns: 4 },
    medium: { pairs: 8, timeBonus: 45, gridColumns: 4 },
    hard: { pairs: 12, timeBonus: 60, gridColumns: 4 },
  };

  useEffect(() => {
    return () => {
      if (gameTimer) clearInterval(gameTimer);
      if (showAllCardsTimer.current) clearTimeout(showAllCardsTimer.current);
    };
  }, []);

  const initializeFlipAnimations = (cardsArray) => {
    const animations = {};
    cardsArray.forEach((card) => {
      animations[card.id] = new Animated.Value(0); 
    });
    setFlipAnimations(animations);
    return animations;
  };

  const handleStartGame = (category = null) => {
    let gameCards;

    if (category) {
      const allCategoryCards = memoryCards.filter(
        (card) => card.category === category
      );

      const pairsMap = {};
      allCategoryCards.forEach((card) => {
        if (!pairsMap[card.back]) {
          pairsMap[card.back] = [];
        }
        pairsMap[card.back].push(card);
      });

      const completePairs = [];
      Object.values(pairsMap).forEach((pair) => {
        if (pair.length === 2) {
          completePairs.push(pair);
        }
      });

      const numPairs = difficultySettings[difficulty].pairs;
      const maxAvailablePairs = completePairs.length;

      if (maxAvailablePairs === 0) {
        Alert.alert("خطأ", `لا توجد أزواج كاملة في الفئة: ${category}`);
        return;
      }

      const pairsToUse = Math.min(numPairs, maxAvailablePairs);

      const shuffledPairs = [...completePairs].sort(() => Math.random() - 0.5);
      const selectedPairs = shuffledPairs.slice(0, pairsToUse);

      const flatCards = selectedPairs.flat();

      gameCards = [...flatCards].sort(() => Math.random() - 0.5);
    } else {
      gameCards = getCardsByDifficulty(difficulty);
    }

    if (gameCards.length % 2 !== 0) {
      console.error("Odd number of cards:", gameCards.length);
      gameCards = gameCards.slice(0, gameCards.length - 1);
    }

    gameCards = gameCards.map((card) => ({
      ...card,
      matched: false,
      flipped: false,
    }));

    const animations = initializeFlipAnimations(gameCards);
    setCards(gameCards);
    setSelectedCategory(category);
    setGameStarted(true);
    setScore(0);
    setMoves(0);
    setMatchedPairs(0);
    setLives(3);
    setTimer(0);
    setFlippedCards([]);
    setGameCompleted(false);
    setShowAllCards(true);

    if (gameTimer) clearInterval(gameTimer);
    if (showAllCardsTimer.current) clearTimeout(showAllCardsTimer.current);

    gameCards.forEach((card) => {
      Animated.spring(animations[card.id], {
        toValue: 1, 
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    });

    showAllCardsTimer.current = setTimeout(() => {
      setShowAllCards(false);
      gameCards.forEach((card) => {
        Animated.spring(animations[card.id], {
          toValue: 0, 
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start();
      });

      const newTimer = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setGameTimer(newTimer);
    }, 3000);
  };

  const handleCardPress = (cardId) => {
    if (showAllCards) return;
    if (flippedCards.length >= 2) return;
    if (cards.find((c) => c.id === cardId)?.matched) return;
    if (flippedCards.includes(cardId)) return;

    flipSound();

    Animated.spring(flipAnimations[cardId], {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      checkForMatch(newFlipped);
    }
  };

  const checkForMatch = (flippedIds) => {
    const [firstId, secondId] = flippedIds;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    setTimeout(() => {
      if (
        firstCard.back === secondCard.back &&
        firstCard.id !== secondCard.id
      ) {
        correctAnswerSound();

        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, matched: true }
              : card
          )
        );

        const pointsEarned = 50 + lives * 10 + Math.max(0, 25 - moves);
        setScore((prev) => prev + pointsEarned);

        const newMatchedPairs = matchedPairs + 1;
        setMatchedPairs(newMatchedPairs);

        const totalPairs = difficultySettings[difficulty].pairs;
        if (newMatchedPairs === totalPairs) {
          finishGame();
        }
      } else {
        wrongAnswerSound();

        Animated.parallel([
          Animated.spring(flipAnimations[firstId], {
            toValue: 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
          }),
          Animated.spring(flipAnimations[secondId], {
            toValue: 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
          }),
        ]).start();

        setLives((prev) => {
          if (prev === 1) {
            setTimeout(() => gameOver(), 500);
          }
          return prev - 1;
        });
      }

      setFlippedCards([]);
    }, 1000);
  };

  const finishGame = () => {
    if (gameTimer) clearInterval(gameTimer);

    const timeBonus = Math.max(
      0,
      difficultySettings[difficulty].timeBonus - timer
    );
    const finalScore = score + timeBonus * 5 + lives * 100;
    setScore(finalScore);

    winSound();

    setTimeout(() => {
      Alert.alert(
        "🎉 مبروك! لقد ربحت 🎉",
        `أكملت اللعبة بنجاح!\n\nالنتائج:\n• النقاط: ${finalScore}\n• الزمن: ${formatTime(
          timer
        )}\n• الحركات: ${moves}\n• الأرواح المتبقية: ${lives}\n\nهل تريد اللعب مرة أخرى؟`,
        [
          { text: "لاحقاً", onPress: () => setGameCompleted(true) },
          { text: "نعم!", onPress: () => handleStartGame(selectedCategory) },
        ]
      );
    }, 500);
  };

  const gameOver = () => {
    if (gameTimer) clearInterval(gameTimer);

    Alert.alert(
      "💔 انتهت اللعبة",
      "لقد نفذت جميع الأرواح!\n\nهل تريد المحاولة مرة أخرى؟",
      [
        { text: "خروج", onPress: () => setGameCompleted(true) },
        {
          text: "حاول مجدداً",
          onPress: () => handleStartGame(selectedCategory),
        },
      ]
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getCardRotation = (cardId) => {
    return flipAnimations[cardId]?.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });
  };

  const getBackCardRotation = (cardId) => {
    return flipAnimations[cardId]?.interpolate({
      inputRange: [0, 1],
      outputRange: ["180deg", "360deg"],
    });
  };

  const handleImageLoadStart = (cardId) => {
    setLoadingImages((prev) => ({ ...prev, [cardId]: true }));
  };

  const handleImageLoadEnd = (cardId) => {
    setLoadingImages((prev) => ({ ...prev, [cardId]: false }));
  };

  const renderCard = (card) => {
    const isFlipped = flippedCards.includes(card.id) || card.matched;
    const isLoading = loadingImages[card.id];

    return (
      <TouchableOpacity
        key={card.id}
        onPress={() => handleCardPress(card.id)}
        disabled={card.matched || flippedCards.length >= 2 || showAllCards}
        style={[
          styles.cardContainer,
          { width: (width - 2) / difficultySettings[difficulty].gridColumns },
        ]}
      >
        <Animated.View
          style={[
            styles.cardBackWrapper,
            {
              transform: [{ rotateY: getCardRotation(card.id) }],
              opacity: flipAnimations[card.id]?.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0, 0],
              }),
            },
          ]}
        >
          <View style={[styles.card, styles.cardBack]}>
            <Text style={styles.cardBackText}>❓</Text>
            {!showAllCards && (
              <Text style={styles.cardBackHint}>انقر لمعرفة</Text>
            )}
          </View>
        </Animated.View>

        {/* Card Front (Image) */}
        <Animated.View
          style={[
            styles.cardFrontWrapper,
            {
              transform: [{ rotateY: getBackCardRotation(card.id) }],
              opacity: flipAnimations[card.id]?.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0, 1],
              }),
            },
          ]}
        >
          <View style={[styles.card, styles.cardFront]}>
            {isLoading && (
              <View style={styles.imageLoading}>
                <ActivityIndicator size="small" color="#3B82F6" />
              </View>
            )}
            <Image
              source={{ uri: card.front }}
              style={styles.cardImage}
              resizeMode="cover"
              onLoadStart={() => handleImageLoadStart(card.id)}
              onLoadEnd={() => handleImageLoadEnd(card.id)}
              onError={() => handleImageLoadEnd(card.id)}
            />

            {/* Show the Arabic name on top of the image when flipped */}
            {(isFlipped || showAllCards) && (
              <View style={styles.cardNameOverlay}>
                <Text style={styles.cardNameText}>{card.back}</Text>
              </View>
            )}

            {!showAllCards && (
              <View style={styles.cardTypeBadge}>
                {/* <Icon
                  name={
                    card.type === "country"
                      ? "flag"
                      : card.type === "city"
                      ? "city"
                      : card.type === "landmark"
                      ? "camera"
                      : card.type === "natural"
                      ? "tree"
                      : "terrain"
                  }
                  size={12}
                  color="#FFFFFF"
                /> */}
              </View>
            )}
          </View>
        </Animated.View>

        {/* Text Overlay for flipped cards */}
        {(isFlipped || showAllCards) && (
          <Animated.View
            style={[
              styles.textOverlay,
              {
                opacity: flipAnimations[card.id]?.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ]}
          >
            <View style={styles.textOverlayContent}></View>
          </Animated.View>
        )}

        {/* Matched Overlay */}
        {card.matched && (
          <View style={styles.matchedOverlay}>
            <Icon name="check-circle" size={32} color="#10B981" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (gameTimer) clearInterval(gameTimer);
            if (showAllCardsTimer.current)
              clearTimeout(showAllCardsTimer.current);
            navigation.goBack();
          }}
        >
          <Icon name="arrow-right" size={24} color="#374151" />
          <Text style={styles.backText}>رجوع</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>لعبة الذاكرة الجغرافية</Text>
          {selectedCategory && (
            <Text style={styles.categoryBadge}>{selectedCategory}</Text>
          )}
        </View>

        <View style={styles.scoreContainer}>
          <Icon name="trophy" size={20} color="#F59E0B" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Game Stats Bar */}
      {gameStarted && !gameCompleted && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Icon name="heart" size={16} color="#EF4444" />
            <Text style={styles.statText}>{lives}</Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="timer" size={16} color="#3B82F6" />
            <Text style={styles.statText}>{formatTime(timer)}</Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="repeat" size={16} color="#8B5CF6" />
            <Text style={styles.statText}>{moves}</Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="puzzle" size={16} color="#10B981" />
            <Text style={styles.statText}>
              {matchedPairs}/{difficultySettings[difficulty].pairs}
            </Text>
          </View>
        </View>
      )}

      {showAllCards && gameStarted && !gameCompleted && (
        <View style={styles.showAllCardsOverlay}>
          <Text style={styles.showAllCardsText}>👀 انظر جيداً و تذكر!</Text>
          <Text style={styles.showAllCardsSubtext}>
            ستظهر جميع البطاقات لمدة 3 ثواني
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        {!gameStarted ? (
          <View style={styles.startScreen}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.gameIconContainer}>
                <Text style={styles.gameIcon}>🧠</Text>
                <View style={styles.pulseEffect} />
              </View>
              <Text style={styles.gameTitle}>لعبة الذاكرة الجغرافية</Text>
              <Text style={styles.gameDescription}>
                اختبر ذاكرتك الجغرافية! شاهد جميع الصور أولاً ثم حاول العثور على
                الأزواج المتطابقة.
              </Text>
            </View>

            {/* Difficulty Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>اختر المستوى</Text>
              <View style={styles.difficultyButtons}>
                {["easy", "medium", "hard"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyButton,
                      difficulty === level && styles.difficultyButtonActive,
                      {
                        backgroundColor:
                          level === "easy"
                            ? "#10B981"
                            : level === "medium"
                            ? "#F59E0B"
                            : "#EF4444",
                      },
                    ]}
                    onPress={() => setDifficulty(level)}
                  >
                    <Text style={styles.difficultyButtonText}>
                      {level === "easy"
                        ? "سهل"
                        : level === "medium"
                        ? "متوسط"
                        : "صعب"}
                    </Text>
                    <Text style={styles.difficultySubtext}>
                      {difficultySettings[level].pairs} أزواج
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>اختر الفئة</Text>
              <Text style={styles.sectionSubtitle}>أو العب جميع الفئات</Text>

              <View style={styles.categoriesGrid}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor:
                          index % 4 === 0
                            ? "#DBEAFE"
                            : index % 4 === 1
                            ? "#D1FAE5"
                            : index % 4 === 2
                            ? "#FEF3C7"
                            : "#EDE9FE",
                      },
                    ]}
                    onPress={() => {
                      setSelectedCategory(category);
                      handleStartGame(category);
                    }}
                  >
                    <Icon
                      name={
                        category === "أعلام الدول"
                          ? "flag"
                          : category === "مدن تونسية"
                          ? "city"
                          : category === "معالم جغرافية"
                          ? "terrain"
                          : category === "معالم سياحية"
                          ? "camera"
                          : category === "معالم طبيعية"
                          ? "tree"
                          : "map"
                      }
                      size={24}
                      color="#1E40AF"
                    />
                    <Text style={styles.categoryText}>{category}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.categoryButton, styles.allCategoriesButton]}
                  onPress={() => {
                    setSelectedCategory(null);
                    handleStartGame();
                  }}
                >
                  <Icon name="earth" size={24} color="#FFFFFF" />
                  <Text style={[styles.categoryText, styles.allCategoriesText]}>
                    جميع الفئات
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rules */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>كيفية اللعب</Text>
              <View style={styles.rulesList}>
                <View style={styles.ruleItem}>
                  <View style={styles.ruleIconContainer}>
                    <Icon name="eye" size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.ruleText}>
                    ستظهر جميع البطاقات أولاً لمدة 3 ثواني
                  </Text>
                </View>

                <View style={styles.ruleItem}>
                  <View style={styles.ruleIconContainer}>
                    <Icon name="gesture-tap" size={20} color="#10B981" />
                  </View>
                  <Text style={styles.ruleText}>
                    اضغط على البطاقة لقلبها ورؤية الاسم
                  </Text>
                </View>

                <View style={styles.ruleItem}>
                  <View style={styles.ruleIconContainer}>
                    <Icon name="check-circle" size={20} color="#10B981" />
                  </View>
                  <Text style={styles.ruleText}>
                    ابحث عن البطاقتين المتطابقتين (الصورة والاسم)
                  </Text>
                </View>

                <View style={styles.ruleItem}>
                  <View style={styles.ruleIconContainer}>
                    <Icon name="heart" size={20} color="#EF4444" />
                  </View>
                  <Text style={styles.ruleText}>لديك 3 أرواح فقط لكل لعبة</Text>
                </View>
              </View>
            </View>
          </View>
        ) : gameCompleted ? (
          <View style={styles.resultsScreen}>
            <View style={styles.resultIconContainer}>
              <Icon name="trophy" size={80} color="#F59E0B" />
            </View>

            <Text style={styles.resultTitle}>نتائج اللعبة</Text>

            <View style={styles.resultsStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>النقاط النهائية</Text>
                <Text style={styles.resultStatValue}>{score}</Text>
              </View>

              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>الزمن المستغرق</Text>
                <Text style={styles.resultStatValue}>{formatTime(timer)}</Text>
              </View>

              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>عدد الحركات</Text>
                <Text style={styles.resultStatValue}>{moves}</Text>
              </View>

              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>الأزواج المتطابقة</Text>
                <Text style={styles.resultStatValue}>
                  {matchedPairs}/{difficultySettings[difficulty].pairs}
                </Text>
              </View>
            </View>

            <View style={styles.resultButtons}>
              <TouchableOpacity
                style={[styles.resultButton, styles.playAgainButton]}
                onPress={() => handleStartGame(selectedCategory)}
              >
                <Icon name="play-circle" size={20} color="#FFFFFF" />
                <Text style={styles.resultButtonText}>العب مجدداً</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.resultButton, styles.menuButton]}
                onPress={() => {
                  setGameStarted(false);
                  setGameCompleted(false);
                }}
              >
                <Icon name="menu" size={20} color="#3B82F6" />
                <Text style={[styles.resultButtonText, styles.menuButtonText]}>
                  القائمة الرئيسية
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.gameBoard}>
            <View style={styles.gameHeader}>
              <View style={styles.gameInfo}>
                <View style={styles.livesContainer}>
                  {[...Array(3)].map((_, i) => (
                    <Icon
                      key={i}
                      name="heart"
                      size={20}
                      color={i < lives ? "#EF4444" : "#D1D5DB"}
                    />
                  ))}
                </View>

                <View style={styles.timerContainer}>
                  <Icon name="timer" size={16} color="#3B82F6" />
                  <Text style={styles.timerText}>{formatTime(timer)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  Alert.alert("إعادة التشغيل", "هل تريد إعادة تشغيل اللعبة؟", [
                    { text: "لا", style: "cancel" },
                    {
                      text: "نعم",
                      onPress: () => handleStartGame(selectedCategory),
                    },
                  ]);
                }}
              >
                <Icon name="refresh" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Game Grid */}
            <View style={styles.cardsGrid}>
              {cards.map((card) => renderCard(card))}
            </View>

            {/* Hints */}
            <View style={styles.hintsContainer}>
              <Text style={styles.hintText}>
                💡 تذكر: ابحث عن الصورة التي تطابق الاسم!
              </Text>
              <Text style={styles.hintSubtext}>
                تم العثور على {matchedPairs} من{" "}
                {difficultySettings[difficulty].pairs} زوج
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    elevation: 4,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  backText: {
    fontSize: 14,
    color: "#374151",
    marginRight: 4,
    fontWeight: "500",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E40AF",
  },
  categoryBadge: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FDE68A",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginLeft: 6,
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  showAllCardsOverlay: {
    backgroundColor: "rgba(59, 130, 246, 0.9)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  showAllCardsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  showAllCardsSubtext: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
    marginTop: 4,
  },
  content: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  startScreen: {
    paddingTop: 20,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  gameIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#38BDF8",
    position: "relative",
  },
  pulseEffect: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#38BDF8",
    opacity: 0.3,
    zIndex: -1,
  },
  gameIcon: {
    fontSize: 70,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 12,
    textAlign: "center",
  },
  gameDescription: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
    textAlign: "center",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "right",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "right",
  },
  difficultyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  difficultyButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  difficultyButtonActive: {
    borderColor: "#FFFFFF",
    transform: [{ scale: 1.05 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  difficultyButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  difficultySubtext: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryButton: {
    width: (width - 48) / 2,
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  allCategoriesButton: {
    backgroundColor: "#1E40AF",
    borderColor: "#1E3A8A",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 8,
  },
  allCategoriesText: {
    color: "#FFFFFF",
  },
  rulesList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  ruleItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  ruleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  ruleText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
    textAlign: "right",
    lineHeight: 20,
  },
  gameBoard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  gameInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  livesContainer: {
    flexDirection: "row",
    gap: 4,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
  },
  resetButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  cardContainer: {
    height: 105,
    marginBottom: 12,
    position: "relative",
  },
  cardBackWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },
  cardFrontWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    overflow: "hidden",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  cardBack: {
    backgroundColor: "#EFF6FF",
    borderColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  cardFront: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DBEAFE",
    position: "relative",
  },
  cardNameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  cardNameText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    writingDirection: "rtl",
  },
  cardImage: {
    width: "100%",
    height: "99%",
  },
  imageLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    zIndex: 1,
  },
  cardTypeBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 4,
    borderRadius: 6,
    zIndex: 2,
  },
  cardBackText: {
    fontSize: 32,
    color: "#3B82F6",
  },
  cardBackHint: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  textOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    zIndex: 3,
  },
  textOverlayContent: {
    padding: 8,
    alignItems: "center",
  },
  overlayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
    writingDirection: "rtl",
  },
  overlayCategory: {
    fontSize: 10,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
    writingDirection: "rtl",
  },
  matchedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    zIndex: 4,
  },
  cardText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  hintsContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginTop: "auto",
  },
  hintText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    textAlign: "center",
    marginBottom: 8,
  },
  hintSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  resultsScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  resultIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 4,
    borderColor: "#F59E0B",
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 32,
  },
  resultsStats: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  resultStat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  resultStatLabel: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "right",
  },
  resultStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  resultButtons: {
    width: "100%",
    gap: 12,
  },
  resultButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  playAgainButton: {
    backgroundColor: "#10B981",
  },
  menuButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  resultButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  menuButtonText: {
    color: "#3B82F6",
  },
});

export default MemoryGameScreen;
