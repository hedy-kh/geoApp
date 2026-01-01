import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PuzzleArray,
  getCategories,
  getCountriesByCategory,
  getGridForCategory,
} from "../../../utils/PuzzleQuizes";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");
const CELL_SIZE = (width - 80) / 3; 

const PuzzleGameScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("شمال أفريقيا");
  const [currentCountries, setCurrentCountries] = useState([]);
  const [currentGrid, setCurrentGrid] = useState([]);
  const [placedPieces, setPlacedPieces] = useState({});
  const [progress, setProgress] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef(null);
  const [gridLayout, setGridLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [gridReady, setGridReady] = useState(false);
  const categories = getCategories();

  // Initialize with selected category
  useEffect(() => {
    loadCategory(selectedCategory);
  }, []);

  const loadCategory = (category) => {
    setIsLoading(true);
    setGridReady(false);

    const countries = getCountriesByCategory(category);
    setCurrentCountries(countries);

    const grid = getGridForCategory(category);
    setCurrentGrid(grid || []);

    // Reset game state
    setPlacedPieces({});
    setProgress(0);
    setPuzzleCompleted(false);
    setSelectedCategory(category);
    setShowCategoryModal(false);

    // Set loading to false and schedule grid measurement
    setTimeout(() => {
      setIsLoading(false);
      measureGrid();
    }, 300);
  };

  // Measure grid position accurately
  const measureGrid = () => {
    if (gridRef.current) {
      requestAnimationFrame(() => {
        gridRef.current.measure((fx, fy, width, height, px, py) => {
          console.log("Grid measured:", { x: px, y: py, width, height });
          setGridLayout({ x: px, y: py, width, height });
          setGridReady(true);
        });
      });
    } else {
      setTimeout(measureGrid, 100);
    }
  };

  const DraggablePiece = ({ piece, isPlaced }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const [isDragging, setIsDragging] = useState(false);
    const pieceRef = useRef(null);

    // Store original position
    const originalPosition = useRef({ x: 0, y: 0 });

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () =>
          !isPlaced && gridReady && !isLoading,
        onMoveShouldSetPanResponder: () => !isPlaced && gridReady && !isLoading,
        onPanResponderGrant: (e, gestureState) => {
          if (!gridReady || isLoading) return false;

          setIsDragging(true);
          // Store original position
          originalPosition.current = {
            x: pan.x._value,
            y: pan.y._value,
          };
          pan.setValue({ x: 0, y: 0 });
          return true;
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (e, gesture) => {
          setIsDragging(false);

          if (!gridReady || !gridLayout || gridLayout.width === 0) {
            resetPiecePosition();
            return;
          }

          // Get drop position relative to screen
          const dropX = e.nativeEvent.pageX;
          const dropY = e.nativeEvent.pageY;

          checkDrop(dropX, dropY, piece);
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          resetPiecePosition();
        },
      })
    ).current;

    const resetPiecePosition = () => {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        tension: 200,
        friction: 8,
      }).start();
    };

    const checkDrop = (dropX, dropY, piece) => {
      // Calculate grid columns based on actual grid content
      const gridCols = 3; // Fixed for consistency
      const cellWidth = gridLayout.width / gridCols;
      const cellHeight =
        gridLayout.height / Math.ceil(currentGrid.length / gridCols);

      // Check if drop is within grid bounds
      const isWithinGrid =
        dropX >= gridLayout.x &&
        dropX <= gridLayout.x + gridLayout.width &&
        dropY >= gridLayout.y &&
        dropY <= gridLayout.y + gridLayout.height;

      if (!isWithinGrid) {
        resetPiecePosition();
        return;
      }

      // Calculate which grid cell was dropped on
      const relativeX = dropX - gridLayout.x;
      const relativeY = dropY - gridLayout.y;

      const col = Math.floor(relativeX / cellWidth);
      const row = Math.floor(relativeY / cellHeight);
      const position = row * gridCols + col;

      // Find the target cell
      const targetCell = currentGrid.find(
        (cell) => cell.position === position && cell.countryId !== null
      );

      if (!targetCell) {
        // Dropped on empty cell
        resetPiecePosition();
        Alert.alert("تنبيه", "هذه الخانة فارغة، اختر خانة بها اسم دولة");
        return;
      }

      // Check if this cell is meant for this country
      if (targetCell.countryId === piece.id) {
        // Correct placement!
        const newPlacedPieces = {
          ...placedPieces,
          [piece.id]: position,
        };
        setPlacedPieces(newPlacedPieces);

        const totalPieces = currentGrid.filter(
          (cell) => cell.countryId !== null
        ).length;
        const newProgress = Math.round(
          (Object.keys(newPlacedPieces).length / totalPieces) * 100
        );
        setProgress(newProgress);

        if (Object.keys(newPlacedPieces).length === totalPieces) {
          setTimeout(() => {
            setPuzzleCompleted(true);
            Alert.alert(
              "مبروك! 🎉",
              `لقد أتممت أحجية ${selectedCategory} بنجاح!`
            );
          }, 500);
        } else {
          Alert.alert("صحيح! ✅", `أحسنت! ${piece.name}`);
        }

        // Calculate position to center the piece in the cell
        const pieceX = col * cellWidth + cellWidth / 2 - 42.5; // 42.5 is half of piece width (85/2)
        const pieceY = row * cellHeight + cellHeight / 2 - 42.5;

        // Move piece to the center of the cell
        Animated.spring(pan, {
          toValue: { x: pieceX, y: pieceY },
          useNativeDriver: false,
          tension: 150,
          friction: 7,
        }).start();
      } else {
        // Wrong placement
        resetPiecePosition();
        Alert.alert("حاول مرة أخرى", `هذا ليس علم ${targetCell.label}`);
      }
    };

    if (isPlaced) {
      return null;
    }

    return (
      <Animated.View
        style={[
          styles.draggablePiece,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            opacity: isDragging ? 0.8 : 1,
            elevation: isDragging ? 10 : 2,
            zIndex: isDragging ? 1000 : 1,
            shadowColor: isDragging ? "#000" : "transparent",
            shadowOffset: { width: 0, height: isDragging ? 5 : 0 },
            shadowOpacity: isDragging ? 0.3 : 0,
            shadowRadius: isDragging ? 10 : 0,
          },
        ]}
        ref={pieceRef}
        {...panResponder.panHandlers}
      >
        <View style={[styles.pieceContent, { borderColor: piece.color }]}>
          {/* SHOW FLAG ONLY - NO NAME */}
          <Text style={styles.pieceFlag}>{piece.flag}</Text>
        </View>
      </Animated.View>
    );
  };

  const resetGame = () => {
    setPlacedPieces({});
    setProgress(0);
    setPuzzleCompleted(false);
    setShowHint(false);
    setGridReady(false);

    // Re-measure grid after reset
    setTimeout(() => {
      measureGrid();
    }, 100);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem,
      ]}
      onPress={() => loadCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
      <Text style={styles.categoryCount}>
        {getCountriesByCategory(item).length} دول
      </Text>
    </TouchableOpacity>
  );

  const CategoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCategoryModal}
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>اختر فئة الدول</Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Icon name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      </View>
    </Modal>
  );

  // Calculate grid dimensions
  const gridCols = 3; // Fixed for consistency
  const gridRows = Math.ceil(currentGrid.length / gridCols);
  const cellSize = (width - 80) / gridCols;

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

        <TouchableOpacity
          style={styles.categorySelector}
          onPress={() => setShowCategoryModal(true)}
        >
          <Icon name="earth" size={20} color="#8B5CF6" />
          <Text style={styles.categoryTitle}>{selectedCategory}</Text>
          <Icon name="chevron-down" size={20} color="#8B5CF6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hintButton}
          onPress={() => setShowHint(!showHint)}
        >
          <Icon name="lightbulb-outline" size={20} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              جاري تحميل {selectedCategory}...
            </Text>
          </View>
        ) : puzzleCompleted ? (
          <View style={styles.completionContainer}>
            <View style={styles.completionBadge}>
              <Icon name="trophy-award" size={60} color="#F59E0B" />
            </View>
            <Text style={styles.congratsText}>مبروك! 🎉</Text>
            <Text style={styles.completionMessage}>
              لقد أتممت تركيب خريطة {selectedCategory} بنجاح!
            </Text>
            <Text style={styles.pointsEarned}>
              +{currentCountries.length * 10} نقطة
            </Text>

            <View style={styles.completionButtons}>
              <TouchableOpacity
                style={styles.playAgainButton}
                onPress={resetGame}
              >
                <Text style={styles.playAgainText}>إعادة نفس المجموعة</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.nextCategoryButton}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={styles.nextCategoryText}>مجموعة أخرى</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.gameInfo}>
              <Text style={styles.instructions}>
                اسحب كل علم إلى اسم الدولة الصحيح
              </Text>
              <Text style={styles.categoryInfo}>
                {selectedCategory} - {currentCountries.length} دولة
              </Text>
              {!gridReady && (
                <Text style={styles.preparingText}>جاري تهيئة اللعبة...</Text>
              )}
            </View>

            {showHint && (
              <View style={styles.hintBox}>
                <Icon name="information" size={20} color="#3B82F6" />
                <Text style={styles.hintText}>
                  تلميح: اسحب العلم إلى المربع الذي يحمل اسم الدولة المناسب
                </Text>
              </View>
            )}

            {/* Drop Grid with Country Names ONLY */}
            <View
              style={styles.gridContainer}
              ref={gridRef}
              onLayout={() => {
                setTimeout(measureGrid, 200);
              }}
            >
              <Text style={styles.gridTitle}>ضع الأعلام في أماكنها</Text>
              <View
                style={[
                  styles.grid,
                  {
                    width: cellSize * gridCols,
                    minHeight: cellSize * gridRows,
                  },
                ]}
              >
                {currentGrid && currentGrid.length > 0 ? (
                  currentGrid.map((cell, index) => {
                    // Find if there's a piece placed here
                    const placedPieceId = Object.keys(placedPieces).find(
                      (pieceId) => placedPieces[pieceId] === cell.position
                    );
                    const placedPiece = currentCountries.find(
                      (p) => p.id === placedPieceId
                    );

                    return (
                      <View
                        key={index}
                        style={[
                          styles.gridCell,
                          {
                            width: cellSize,
                            height: cellSize,
                          },
                        ]}
                      >
                        {cell.countryId ? (
                          // Cell with country name ONLY (no flags initially)
                          <View
                            style={[
                              styles.countryCell,
                              placedPiece && {
                                borderColor: placedPiece.color,
                                backgroundColor: placedPiece.color + "20",
                              },
                              !placedPiece && {
                                borderStyle: "dashed",
                                backgroundColor: "#F9FAFB",
                              },
                            ]}
                          >
                            {placedPiece ? (
                              // Show flag only when placed (quiz completed for this cell)
                              <>
                                <Text style={styles.placedFlag}>
                                  {placedPiece.flag}
                                </Text>
                                <Text style={styles.placedName}>
                                  {placedPiece.name}
                                </Text>
                              </>
                            ) : (
                              // Show ONLY country name as target (no icon)
                              <Text style={styles.countryName}>
                                {cell.label}
                              </Text>
                            )}
                          </View>
                        ) : (
                          // Empty cell
                          <View style={styles.emptyCell} />
                        )}
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noGridText}>جاري تحميل الشبكة...</Text>
                )}
              </View>
            </View>

            {/* Draggable Flag Pieces - FLAGS ONLY */}
            <View style={styles.piecesSection}>
              <Text style={styles.piecesTitle}>اسحب الأعلام: 🏁</Text>
              <View style={styles.piecesContainer}>
                {currentCountries && currentCountries.length > 0 ? (
                  currentCountries.map((piece) => (
                    <DraggablePiece
                      key={piece.id}
                      piece={piece}
                      isPlaced={placedPieces[piece.id] !== undefined}
                    />
                  ))
                ) : (
                  <Text style={styles.noPiecesText}>
                    لا توجد دول في هذه الفئة
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                <Icon name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.resetText}>إعادة البداية</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeCategoryButton}
                onPress={() => setShowCategoryModal(true)}
              >
                <Icon name="swap-horizontal" size={20} color="#8B5CF6" />
                <Text style={styles.changeCategoryText}>تغيير المجموعة</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      <CategoryModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
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
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B21B6",
  },
  hintButton: {
    padding: 8,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
  },
  progressText: {
    position: "absolute",
    right: 16,
    top: -20,
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
  },
  gameInfo: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructions: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    fontWeight: "600",
  },
  categoryInfo: {
    fontSize: 14,
    color: "#8B5CF6",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "500",
  },
  preparingText: {
    fontSize: 12,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  hintText: {
    fontSize: 14,
    color: "#1E40AF",
    flex: 1,
  },
  gridContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    minHeight: 300,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  gridCell: {
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  countryCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    padding: 8,
    width: "100%",
    height: "100%",
  },
  emptyCell: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "100%",
    height: "100%",
  },
  countryName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5B21B6",
    textAlign: "center",
  },
  placedFlag: {
    fontSize: 32,
  },
  placedName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 4,
    textAlign: "center",
  },
  noGridText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    padding: 20,
  },
  piecesSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 150,
  },
  piecesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "right",
  },
  piecesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    position: "relative",
  },
  noPiecesText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    padding: 20,
  },
  draggablePiece: {
    width: 85,
    height: 85,
    position: "relative",
  },
  pieceContent: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  pieceFlag: {
    fontSize: 40,
  },
  // Removed pieceName style since we're only showing flags
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  changeCategoryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#8B5CF6",
  },
  changeCategoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  completionContainer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#FDE68A",
    marginTop: 40,
  },
  completionBadge: {
    marginBottom: 24,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#D97706",
    marginBottom: 16,
  },
  completionMessage: {
    fontSize: 18,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 28,
  },
  pointsEarned: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 32,
  },
  completionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  playAgainButton: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  nextCategoryButton: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  nextCategoryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "90%",
    maxHeight: "70%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categoryItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedCategoryItem: {
    backgroundColor: "#EDE9FE",
    borderColor: "#8B5CF6",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 4,
  },
  selectedCategoryText: {
    color: "#5B21B6",
  },
  categoryCount: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});

export default PuzzleGameScreen;
