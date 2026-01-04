import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Meduimtwo from "./Meduimtwo";
import { countriesSizes } from "../../../../../utils/countriesSizes";

const formatSize = (size) => {
  return `${size} كم²`;
};

// Helper function to parse size string to number
const parseSizeToNumber = (sizeString) => {
  // Remove commas and any whitespace, then parse to number
  return parseInt(sizeString.replace(/,/g, "").trim());
};

const Meduimone = () => {
  const [countries, setCountries] = useState([]);
  const [sortedCountries, setSortedCountries] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    generateNewQuiz();
  }, []);

  const generateNewQuiz = () => {
    // Get 5 random countries
    const countryNames = Object.keys(countriesSizes);
    const shuffled = countryNames.sort(() => 0.5 - Math.random());
    const selectedCountries = shuffled.slice(0, 5);

    // Shuffle for display
    const shuffledForDisplay = [...selectedCountries].sort(
      () => 0.5 - Math.random()
    );

    setCountries(shuffledForDisplay);
    setSortedCountries([]);
    setIsCompleted(false);
    setShowNext(false);
  };

  const handleCountryPress = (country) => {
    if (sortedCountries.includes(country)) {
      // Remove from sorted list
      setSortedCountries(sortedCountries.filter((c) => c !== country));
    } else {
      // Add to sorted list
      setSortedCountries([...sortedCountries, country]);
    }
  };

  const checkAnswer = () => {
    if (sortedCountries.length !== 5) return;

    // Check if sorted correctly (biggest to smallest)
    const correctOrder = [...countries].sort(
      (a, b) =>
        parseSizeToNumber(countriesSizes[b]) -
        parseSizeToNumber(countriesSizes[a])
    );

    const isCorrect = sortedCountries.every(
      (country, index) => country === correctOrder[index]
    );

    if (isCorrect) {
      setIsCompleted(true);
    } else {
      alert("❌ ترتيب غير صحيح! حاول مرة أخرى");
      setSortedCountries([]);
    }
  };

  const getBarWidth = (size) => {
    const maxSize = Math.max(
      ...countries.map((c) => parseSizeToNumber(countriesSizes[c]))
    );
    return (parseSizeToNumber(size) / maxSize) * 100;
  };

  const getPositionNumber = (country) => {
    const index = sortedCountries.indexOf(country);
    return index >= 0 ? index + 1 : null;
  };

  if (showNext) {
    return <Meduimtwo />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>رتب الدول من الأكبر إلى الأصغر مساحة</Text>
      {/* Instruction */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          اضغط على الدول لترتيبها من الأكبر مساحة إلى الأصغر
        </Text>
      </View>

      {/* Countries to sort */}
      <View style={styles.countriesContainer}>
        {countries.map((country) => {
          const isSelected = sortedCountries.includes(country);
          const position = getPositionNumber(country);
          const size = countriesSizes[country];
          const barWidth = getBarWidth(size);

          return (
            <TouchableOpacity
              key={country}
              style={[styles.countryBar, isSelected && styles.selectedBar]}
              onPress={() => handleCountryPress(country)}
              activeOpacity={0.7}
            >
              <View style={styles.countryInfo}>
                {position && (
                  <View style={styles.positionBadge}>
                    <Text style={styles.positionText}>{position}</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.countryName,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {country}
                </Text>
                <Text
                  style={[
                    styles.countrySize,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {isCompleted? formatSize(size):''}
                </Text>
              </View>

              {/* <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    { width: `${barWidth}%` },
                    isSelected && styles.selectedBarFill,
                  ]}
                />
              </View> */}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sorted Preview */}
      {sortedCountries.length > 0 && (
        <View style={styles.sortedPreview}>
          <Text style={styles.sortedTitle}>الترتيب الحالي:</Text>
          <View style={styles.sortedList}>
            {sortedCountries.map((country, index) => (
              <View key={country} style={styles.sortedItem}>
                <Text style={styles.sortedNumber}>{index + 1}</Text>
                <Text style={styles.sortedCountry}>{country}</Text>
                {isCompleted && <Text style={styles.checkMark}>✓</Text>}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Check Button */}
      {sortedCountries.length === 5 && !isCompleted && (
        <TouchableOpacity
          style={styles.checkButton}
          onPress={checkAnswer}
          activeOpacity={0.7}
        >
          <Text style={styles.checkButtonText}>تحقق من الإجابة</Text>
        </TouchableOpacity>
      )}

      {/* Success Message */}
      {isCompleted && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>🎉 إجابة صحيحة! أحسنت</Text>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setShowNext(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>التالي</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Try Again Button */}
      <TouchableOpacity
        style={styles.newGameButton}
        onPress={generateNewQuiz}
        activeOpacity={0.7}
      >
        <Text style={styles.newGameButtonText}>
          {isCompleted ? "لعبة جديدة" : "إعادة تعيين"}
        </Text>
      </TouchableOpacity>

      {/* Instructions at bottom */}
      <View style={styles.instructions}>
        <Text style={styles.instructionDetailText}>💡 كيفية اللعب:</Text>
        <Text style={styles.instructionDetailText}>
          1. اضغط على الدولة الأكبر مساحة أولاً
        </Text>
        <Text style={styles.instructionDetailText}>
          2. ثم الدولة التي تليها في المساحة
        </Text>
        <Text style={styles.instructionDetailText}>
          3. استمر حتى ترتب جميع الدول من الأكبر إلى الأصغر
        </Text>
        <Text style={styles.instructionDetailText}>
          4. اضغط "تحقق من الإجابة" عند الانتهاء
        </Text>
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  instructionBox: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  instructionText: {
    fontSize: 16,
    color: "#1976D2",
    textAlign: "center",
    fontWeight: "600",
  },
  countriesContainer: {
    marginBottom: 20,
  },
  countryBar: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedBar: {
    borderColor: "#2196F3",
    backgroundColor: "#E3F2FD",
  },
  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  positionBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  positionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  countryName: {
      fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  countrySize: {
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    color: "#2196F3",
  },
  barContainer: {
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: "#9E9E9E",
    borderRadius: 10,
  },
  selectedBarFill: {
    backgroundColor: "#2196F3",
  },
  sortedPreview: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  sortedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  sortedList: {
    gap: 10,
  },
  sortedItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  sortedNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginRight: 15,
    width: 25,
  },
  sortedCountry: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  checkMark: {
    fontSize: 24,
    color: "#4CAF50",
  },
  checkButton: {
    backgroundColor: "#FF9800",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  successText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  nextButtonText: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
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
    borderLeftColor: "#FF9800",
    marginBottom: 20,
  },
  instructionDetailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "right",
  },
});

export default Meduimone;
