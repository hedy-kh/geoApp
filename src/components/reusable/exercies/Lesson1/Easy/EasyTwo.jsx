import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { allCountries } from "../../../../../utils/allCountries";
import Svg, { Line, Polygon } from "react-native-svg";
const EasyTwo = () => {
  const [countries, setCountries] = useState([]);
  const [capitals, setCapitals] = useState([]);
  const [matches, setMatches] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [countryPositions, setCountryPositions] = useState({});
  const [capitalPositions, setCapitalPositions] = useState({});

  useEffect(() => {
    generateNewQuiz();
  }, []);

  const generateNewQuiz = () => {
    const countryNames = Object.keys(allCountries);
    const shuffled = countryNames.sort(() => 0.5 - Math.random());
    const selectedCountries = shuffled.slice(0, 5);

    const selectedCapitals = selectedCountries.map((c) => allCountries[c]);
    const shuffledCapitals = [...selectedCapitals].sort(
      () => 0.5 - Math.random()
    );

    setCountries(selectedCountries);
    setCapitals(shuffledCapitals);
    setMatches({});
    setSelectedCountry(null);
    setFeedback({});
    setIsCompleted(false);
    setCountryPositions({});
    setCapitalPositions({});
  };

  const handleCountryPress = (country) => {
    if (feedback[country] === "correct") return;
    setSelectedCountry(country);
  };

  const handleCapitalPress = (capital) => {
    if (!selectedCountry) return;

    const correctCapital = allCountries[selectedCountry];
    const isCorrect = correctCapital === capital;

    const newMatches = { ...matches, [selectedCountry]: capital };
    setMatches(newMatches);

    const newFeedback = {
      ...feedback,
      [selectedCountry]: isCorrect ? "correct" : "wrong",
    };
    setFeedback(newFeedback);

    setSelectedCountry(null);

    const allCorrect = countries.every(
      (country) => newFeedback[country] === "correct"
    );

    if (allCorrect) {
      setIsCompleted(true);
    }
  };

  const onCountryLayout = (country, event) => {
    const { y, height } = event.nativeEvent.layout;
    setCountryPositions((prev) => ({
      ...prev,
      [country]: y + height / 2,
    }));
  };

  const onCapitalLayout = (capital, event) => {
    const { y, height } = event.nativeEvent.layout;
    setCapitalPositions((prev) => ({
      ...prev,
      [capital]: y + height / 2,
    }));
  };

  const getArrowColor = (country) => {
    if (!matches[country]) return "transparent";
    return feedback[country] === "correct" ? "#4CAF50" : "#F44336";
  };

  const renderArrows = () => {
    return Object.keys(matches).map((country) => {
      const capital = matches[country];
      const startY = countryPositions[country];
      const endY = capitalPositions[capital];

      if (startY === undefined || endY === undefined) return null;

      const color = getArrowColor(country);
      if (color === "transparent") return null;

      // Arrow calculation
      const startX = 10;
      const endX = 50;

      // Calculate angle for arrowhead
      const angle = Math.atan2(endY - startY, endX - startX);
      const arrowSize = 8;

      const arrowPoint1X = endX - arrowSize * Math.cos(angle - Math.PI / 6);
      const arrowPoint1Y = endY - arrowSize * Math.sin(angle - Math.PI / 6);
      const arrowPoint2X = endX - arrowSize * Math.cos(angle + Math.PI / 6);
      const arrowPoint2Y = endY - arrowSize * Math.sin(angle + Math.PI / 6);

      return (
        <Svg
          key={country}
          style={StyleSheet.absoluteFill}
          width="100%"
          height="100%"
        >
          <Line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={color}
            strokeWidth="3"
          />
          <Polygon
            points={`${endX},${endY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
            fill={color}
          />
        </Svg>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>طابق الدول بعواصمها</Text>

      <View style={styles.gameContainer}>
        <View style={styles.column}>
          {countries.map((country, index) => (
            <TouchableOpacity
              key={country}
              style={[
                styles.item,
                selectedCountry === country && styles.selectedItem,
                feedback[country] === "correct" && styles.correctItem,
              ]}
              onPress={() => handleCountryPress(country)}
              onLayout={(e) => onCountryLayout(country, e)}
              disabled={feedback[country] === "correct"}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.itemText,
                  selectedCountry === country && styles.selectedText,
                  feedback[country] === "correct" && styles.correctText,
                ]}
              >
                {country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.arrowColumn}>{renderArrows()}</View>

        {/* Capitals Column */}
        <View style={styles.column}>
          {capitals.map((capital, index) => (
            <TouchableOpacity
              key={capital}
              style={[
                styles.item,
                Object.values(matches).includes(capital) &&
                  feedback[
                    Object.keys(matches).find((k) => matches[k] === capital)
                  ] === "correct" &&
                  styles.correctItem,
              ]}
              onPress={() => handleCapitalPress(capital)}
              onLayout={(e) => onCapitalLayout(capital, e)}
              disabled={!selectedCountry}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.itemText,
                  Object.values(matches).includes(capital) &&
                    feedback[
                      Object.keys(matches).find((k) => matches[k] === capital)
                    ] === "correct" &&
                    styles.correctText,
                ]}
              >
                {capital}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isCompleted && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>🎉 أحسنت! إجابات صحيحة</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.newGameButton}
        onPress={generateNewQuiz}
        activeOpacity={0.7}
      >
        <Text style={styles.newGameButtonText}>
          {isCompleted ? "لعبة جديدة" : "إعادة المحاولة"}
        </Text>
      </TouchableOpacity>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>1. اضغط على دولة</Text>
        <Text style={styles.instructionText}>2. ثم اضغط على عاصمتها</Text>
        <Text style={styles.instructionText}>🟢 أخضر = صحيح</Text>
        <Text style={styles.instructionText}>🔴 أحمر = خطأ</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  gameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    minHeight: 400,
  },
  column: {
    flex: 1,
    zIndex: 2,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedItem: {
    borderColor: "#2196F3",
    backgroundColor: "#E3F2FD",
  },
  correctItem: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  selectedText: {
    color: "#2196F3",
  },
  correctText: {
    color: "#4CAF50",
  },
  arrowColumn: {
    width: 60,
    position: "relative",
    zIndex: 1,
  },
  successContainer: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  newGameButton: {
    backgroundColor: "#2196F3",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  newGameButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  instructions: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "right",
  },
});

export default EasyTwo;
