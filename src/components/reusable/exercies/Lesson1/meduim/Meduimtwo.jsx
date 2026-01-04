import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import Svg, { Path, Text as SvgText, G } from "react-native-svg";
import useSound from "../../../../../hooks/useSound";

const { width, height } = Dimensions.get("window");

const Meduimtwo = () => {
  const { wrongAnswerSound, correctAnswerSound, winSound } = useSound();

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);


  const francePath =
    "M 1014.4 185 1015.5 185.5 1016.9 185.4 1019.3 187 1026.5 188.2 1024.1 192.4 1023.7 196.9 1022.4 198 1020.1 197.4 1020.3 199 1016.7 202.5 1016.7 205.4 1019.1 204.4 1020.9 207.1 1020.8 208.9 1022.3 211.3 1020.6 213.2 1022.1 218.1 1024.9 218.9 1024.4 221.6 1019.9 225.2 1009.7 223.5 1002.3 225.6 1001.7 229.4 995.8 230.2 990 227.3 988.1 228.7 978.6 225.8 976.6 223.4 979.3 219.6 980.3 207 975.2 200.4 971.5 197.2 963.9 194.8 963.5 190.2 970 188.9 978.3 190.5 976.8 183.4 981.5 186.1 992.9 181.3 994.4 176.2 998.6 174.9 999.4 177.1 1001.6 177.2 1004 179.7 1007.5 182.6 1010 182.1 1014.4 185 Z";

  const franceData = {
    name: "فرنسا",
    area: 543.941,
    color: "#1E90FF",
  };

  const northAfricanCountries = [
    {
      id: "ALGERIA",
      name: "الجزائر",
      area: 2381741,
      color: "#FF6B6B",
      correct: true,
    },
    {
      id: "LIBYA",
      name: "ليبيا",
      area: 1759540,
      color: "#4ECDC4",
      correct: true,
    },
    {
      id: "MAURITANIA",
      name: "موريتانيا",
      area: 1030700,
      color: "#FFD93D",
      correct: true,
    },
    {
      id: "MOROCCO",
      name: "المغرب",
      area: 446550,
      color: "#6BCF7F",
      correct: false,
    },
    {
      id: "TUNISIA",
      name: "تونس",
      area: 163610,
      color: "#9B59B6",
      correct: false,
    },
  ];


  const handleCountrySelect = (id) => {
    if (submitted) return;

    setSelectedCountries((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selectedCountries.length === 0) {
      Alert.alert("تنبيه", "يرجى اختيار دولة واحدة على الأقل");
      return;
    }

    let correctCount = 0;
    selectedCountries.forEach((id) => {
      const country = northAfricanCountries.find((c) => c.id === id);
      if (country?.correct) correctCount++;
    });

    setScore(correctCount);
    setSubmitted(true);

    if (correctCount === 3) winSound();
    else if (correctCount > 0) correctAnswerSound();
    else wrongAnswerSound();
  };

  const handleReset = () => {
    setSelectedCountries([]);
    setSubmitted(false);
    setScore(0);
  };

  const getCountryStyle = (id) => {
    if (!submitted)
      return selectedCountries.includes(id)
        ? styles.selectedCountry
        : styles.countryButton;

    const country = northAfricanCountries.find((c) => c.id === id);
    if (!selectedCountries.includes(id)) return styles.countryButton;

    return country.correct ? styles.correctSelected : styles.wrongSelected;
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>تحدي الجغرافيا 🌍</Text>
      <Text style={styles.subtitle}>اختر الدول التي مساحتها أكبر من فرنسا</Text>

      {/* فرنسا */}
      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>الدولة المرجعية: فرنسا</Text>
        <Text style={{ textAlign: "right" }}>632,702 كم²</Text>
        <View style={styles.mapContainer}>
          <Svg width="100%" height={200} viewBox="910 150 100 100">
            <Path
              d={francePath}
              fill={franceData.color}
              stroke="#000"
              strokeWidth="0.5"
            />
            <G></G>
          </Svg>
        </View>
      </View>

      {/* الدول */}
      <View style={styles.countriesSection}>
        <Text style={styles.instructions}>
          اختر جميع الدول التي مساحتها أكبر من مساحة فرنسا
        </Text>

        {northAfricanCountries.map((country) => (
          <TouchableOpacity
            key={country.id}
            style={getCountryStyle(country.id)}
            onPress={() => handleCountrySelect(country.id)}
            disabled={submitted}
          >
            <View
              style={[
                styles.countryColorDot,
                { backgroundColor: country.color },
              ]}
            />
            <View style={styles.countryInfo}>
              <Text style={styles.countryName}>{country.name}</Text>
              <Text style={styles.countryArea}>
                {submitted
                  ? `المساحة: ${country.area.toLocaleString()} كم²`
                  : "اضغط للاختيار"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* النتائج */}
        {submitted && (
          <>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>النتيجة</Text>
              <Text style={styles.scoreText}>
                {score} / {selectedCountries.length}
              </Text>
              <Text style={styles.resultDetails}>
                {score === 3
                  ? "ممتاز! جميع الإجابات صحيحة 🎉"
                  : score > 0
                  ? "جيد! بعض الإجابات صحيحة 👍"
                  : "حاول مرة أخرى 💪"}
              </Text>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>أعد المحاولة</Text>
            </TouchableOpacity>
          </>
        )}

        {!submitted && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>تحقق من الإجابة</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

/* ================= الأنماط ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#2c3e50",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 20,
  },
  mapSection: { marginHorizontal: 20 },
  sectionTitle: { fontSize: 19, fontWeight: "bold",textAlign:'right' },
  mapContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
  },
  countriesSection: { margin: 20 },
  instructions: {
    backgroundColor: "#e8f4fc",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 15,
  },
  countryButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 10,
  },
  selectedCountry: {
    backgroundColor: "#e3f2fd",
    borderWidth: 2,
    borderColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 10,
  },
  correctSelected: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 10,
  },
  wrongSelected: {
    backgroundColor: "#f8d7da",
    borderColor: "#dc3545",
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 10,
  },
  countryColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  countryInfo: { flex: 1 },
  countryName: { fontSize: 18, fontWeight: "600" },
  countryArea: { fontSize: 14, color: "#7f8c8d" },
  submitButton: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  resultTitle: { fontSize: 20, fontWeight: "bold" },
  scoreText: { fontSize: 28, fontWeight: "bold", color: "#e74c3c" },
  resultDetails: { fontSize: 16, textAlign: "center" },
  resetButton: {
    backgroundColor: "#2c3e50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Meduimtwo;
