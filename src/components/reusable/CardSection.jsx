import { useState } from 'react';
import { View, Text,StyleSheet,Image,TouchableOpacity,Dimensions } from 'react-native'
const { width, height } = Dimensions.get("window");
const isSmallScreen = width < 375;
const isLargeScreen = width > 414;
const CardSection = ({ cardData }) => {
const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  const cards =
    cardData?.cards ||
    (cardData
      ? [{ id: "legacy", blocks: convertLegacyToBlocks(cardData) }]
      : []);
  if (cards.length === 0) return null;
  const currentCard = cards[currentCardIndex];
  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };
  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };
  const renderBlock = (block, index) => {
    switch (block.type) {
      case "main":
        return (
          <View key={index} style={sharedStyles.mainTitleContainer}>
            <Text style={sharedStyles.mainTitle} numberOfLines={3}>
              {block.text}
            </Text>
            <View style={sharedStyles.blueDot} />
          </View>
        );

      case "section":
        if (block.captial !== undefined || block.indepandce !== undefined) {
          return (
            <View key={index} style={sharedStyles.tableRow}>
              <View style={sharedStyles.tableCell}>
                <Text style={sharedStyles.tableCellLabel}>تاريخ الاستقلال</Text>
                <Text style={sharedStyles.tableCellValue}>
                  {block.indepandce || "—"}
                </Text>
              </View>
              <View style={sharedStyles.tableCell}>
                <Text style={sharedStyles.tableCellLabel}>العاصمة</Text>
                <Text style={sharedStyles.tableCellValue}>
                  {block.captial || "—"}
                </Text>
              </View>
              <View style={sharedStyles.tableCell}>
                <Text style={sharedStyles.tableCellLabel}>الدولة</Text>
                <Text style={sharedStyles.tableCellValue}>
                  {block.text || "—"}
                </Text>
              </View>
            </View>
          );
        }

        if (block.uri) {
          try {
            return (
              <View key={index} style={sharedStyles.sectionWithImage}>
                <Image
                  source={
                    typeof block.uri === "string"
                      ? { uri: block.uri }
                      : block.uri
                  }
                  style={sharedStyles.sectionImage}
                  resizeMode="contain"
                  onError={(error) =>
                    console.log("Image loading error:", error.nativeEvent.error)
                  }
                />
                {block.text && (
                  <View style={sharedStyles.sectionTextContainer}>
                    <Text style={sharedStyles.sectionText} numberOfLines={4}>
                      {block.text}
                    </Text>
                    <View style={sharedStyles.blueDot} />
                  </View>
                )}
              </View>
            );
          } catch (error) {
            console.log("Error loading image:", error);
            return (
              <View key={index} style={sharedStyles.sectionCard}>
                <Text style={sharedStyles.sectionText} numberOfLines={6}>
                  {block.text}
                </Text>
                <View style={sharedStyles.blueDot} />
              </View>
            );
          }
        }
        if (block.text) {
          return (
            <View key={index} style={sharedStyles.sectionCard}>
              <Text style={sharedStyles.sectionText} numberOfLines={6}>
                {block.text}
              </Text>
              <View style={sharedStyles.blueDot} />
            </View>
          );
        }
        if (Object.keys(block).length > 1) {
          return (
            <View key={index} style={sharedStyles.sectionCard}>
              <Text style={sharedStyles.sectionText} numberOfLines={6}>
                {JSON.stringify(block, null, 2)}
              </Text>
              <View style={sharedStyles.blueDot} />
            </View>
          );
        }

        return null;

      case "image":
        try {
          return (
            <View key={index} style={sharedStyles.imageContainer}>
              <Image
                source={
                  typeof block.uri === "string" ? { uri: block.uri } : block.uri
                }
                style={sharedStyles.cardImage}
                resizeMode="contain"
                onError={(error) =>
                  console.log("Image loading error:", error.nativeEvent.error)
                }
              />
            </View>
          );
        } catch (error) {
          console.log("Error loading standalone image:", error);
          return (
            <View key={index} style={sharedStyles.sectionCard}>
              <Text style={sharedStyles.sectionText}>
                [Image not available]
              </Text>
            </View>
          );
        }

      default:
        if (block.text) {
          return (
            <View key={index} style={sharedStyles.sectionCard}>
              <Text style={sharedStyles.sectionText} numberOfLines={6}>
                {block.text}
              </Text>
              <View style={sharedStyles.blueDot} />
            </View>
          );
        }
        return null;
    }
  };

  return (
    <View style={sharedStyles.cardContainer}>
      <View style={sharedStyles.backgroundEmoji}>
        <Text style={sharedStyles.largeEmoji}>📝</Text>
      </View>

      <View style={sharedStyles.cardContent}>
        {/* Header */}
        <View style={sharedStyles.cardHeader}>
          <View style={sharedStyles.cardHeaderIcon}>
            <Text style={sharedStyles.cardHeaderIconText}>📖</Text>
          </View>
          <Text style={sharedStyles.cardHeaderTitle}>التلخيص الذكي</Text>
        </View>

        {/* Card Progress Indicator */}
        {cards.length > 1 && (
          <View style={sharedStyles.progressContainer}>
            <Text style={sharedStyles.progressText}>
              البطاقة {currentCardIndex + 1} من {cards.length}
            </Text>
            <View style={sharedStyles.dotsContainer}>
              {cards.map((_, index) => (
                <View
                  key={index}
                  style={[
                    sharedStyles.dot,
                    index === currentCardIndex && sharedStyles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Render Current Card Blocks */}
        <View style={sharedStyles.sectionsContainer}>
          {currentCard.blocks.map((block, index) => {
            // Skip null blocks
            if (!block) return null;

            // Add a unique key combining card index and block index
            const uniqueKey = `card-${currentCardIndex}-block-${index}`;

            // Use a wrapper component to ensure each block gets rendered
            return <View key={uniqueKey}>{renderBlock(block, index)}</View>;
          })}
        </View>

        {/* Navigation Buttons */}
        {cards.length > 1 && (
          <View style={sharedStyles.navigationContainer}>
            <TouchableOpacity
              onPress={goToPrevCard}
              disabled={currentCardIndex === 0}
              style={[
                sharedStyles.navButton,
                currentCardIndex === 0 && sharedStyles.navButtonDisabled,
              ]}
            >
              <Text style={sharedStyles.navButtonText}>👈🏻</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goToNextCard}
              disabled={currentCardIndex === cards.length - 1}
              style={[
                sharedStyles.navButton,
                currentCardIndex === cards.length - 1 &&
                  sharedStyles.navButtonDisabled,
              ]}
            >
              <Text style={sharedStyles.navButtonText}>👉🏻</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const convertLegacyToBlocks = (cardData) => {
  const blocks = [];

  if (cardData.title) {
    blocks.push({ type: "main", text: cardData.title });
  }

  if (cardData.title2) {
    blocks.push({ type: "section", text: cardData.title2 });
  }

  Object.entries(cardData)
    .filter(([key]) => key.startsWith("sec"))
    .forEach(([_, value]) => {
      blocks.push({ type: "section", text: value });
    });

  return blocks;
};
const sharedStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: isSmallScreen ? 24 : isLargeScreen ? 40 : 32,
    padding: isSmallScreen ? 16 : isLargeScreen ? 32 : 24,
    marginHorizontal: isSmallScreen ? 12 : 16,
    marginBottom: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    position: "relative",
    minHeight: isSmallScreen ? 200 : 250,
  },
  backgroundEmoji: {
    position: "absolute",
    top: isSmallScreen ? 20 : 30,
    left: isSmallScreen ? 20 : 30,
    opacity: 0.05,
  },
  largeEmoji: {
    fontSize: isSmallScreen ? 80 : isLargeScreen ? 140 : 100,
    fontWeight: "900",
  },
  cardContent: {
    position: "relative",
    zIndex: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: isSmallScreen ? 8 : 12,
    marginBottom: isSmallScreen ? 20 : 24,
  },
  cardHeaderIcon: {
    backgroundColor: "#dbeafe",
    padding: isSmallScreen ? 10 : 14,
    borderRadius: isSmallScreen ? 20 : 24,
  },
  cardHeaderIconText: {
    fontSize: isSmallScreen ? 22 : 26,
  },
  cardHeaderTitle: {
    fontSize: isSmallScreen ? 18 : isLargeScreen ? 26 : 22,
    fontWeight: "900",
    color: "#1e293b",
    textAlign: "right",
    flex: 1,
  },
  sectionsContainer: {
    gap: isSmallScreen ? 12 : 16,
  },
  mainTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: isSmallScreen ? 12 : 16,
    padding: isSmallScreen ? 16 : 20,
    backgroundColor: "#f8fafc",
    borderRadius: isSmallScreen ? 20 : 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: isSmallScreen ? 12 : 16,
    padding: isSmallScreen ? 16 : 20,
    backgroundColor: "#eff6ff",
    borderRadius: isSmallScreen ? 20 : 24,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  sectionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: isSmallScreen ? 12 : 16,
    padding: isSmallScreen ? 16 : 20,
    backgroundColor: "#f8fafc",
    borderRadius: isSmallScreen ? 20 : 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  blueDot: {
    width: isSmallScreen ? 12 : 14,
    height: isSmallScreen ? 12 : 14,
    backgroundColor: "#60a5fa",
    borderRadius: isSmallScreen ? 6 : 7,
    marginTop: isSmallScreen ? 4 : 6,
    shadowColor: "#60a5fa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  mainTitle: {
    fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
    fontWeight: "bold",
    color: "#1e293b",
    lineHeight: isSmallScreen ? 22 : 26,
    flex: 1,
    textAlign: "right",
  },
  subtitle: {
    fontSize: isSmallScreen ? 15 : isLargeScreen ? 18 : 16,
    fontWeight: "800",
    color: "#334155",
    lineHeight: isSmallScreen ? 22 : 24,
    flex: 1,
    textAlign: "right",
  },
  sectionText: {
    fontSize: isSmallScreen ? 14 : isLargeScreen ? 16 : 15,
    fontWeight: "600",
    color: "#475569",
    lineHeight: isSmallScreen ? 20 : 22,
    flex: 1,
    textAlign: "right",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  progressText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: "#64748b",
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cbd5e1",
  },
  activeDot: {
    backgroundColor: "#60a5fa",
    width: 24,
  },
  sectionWithImage: {
    flexDirection: "column",
    gap: 12,
    padding: isSmallScreen ? 16 : 20,
    backgroundColor: "#f8fafc",
    borderRadius: isSmallScreen ? 20 : 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  sectionTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between", 
    padding: isSmallScreen ? 12 : 16,
    backgroundColor: "#eff6ff",
    borderRadius: isSmallScreen ? 16 : 20,
    borderWidth: 1,
    borderColor: "#dbeafe",
    marginBottom: 8,
  },
  tableCell: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 4,
},
tableCellLabel: {
  fontSize: isSmallScreen ? 11 : 12,
  color: "#64748b",
  fontWeight: "600",
  textAlign: "center",
  marginBottom: 4,
},
tableCellValue: {
  fontSize: isSmallScreen ? 14 : 15,
  color: "#1e293b",
  fontWeight: "bold",
  textAlign: "center",
  lineHeight: 20,
},
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: "#60a5fa",
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonDisabled: {
    backgroundColor: "#cbd5e1",
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default CardSection