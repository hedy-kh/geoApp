import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import useSound from "../../../../../hooks/useSound";
import HardFive from "./HardFive";

const MAIN_CONCEPTS = [
  ["البحر", "بحر", "الساحل", "السواحل", "بعيد عن البحر", "البعد عن البحر"],
  [
    "الكتل الهوائية",
    "الكتل",
    "الهوائية",
    "الرياح الرطبة",
    "الرياح",
    "هواء رطب",
    "كتل هوائية",
  ],
  ["رطبة", "الرطوبة", "قلة الرطوبة", "جفاف", "جاف", "مناخ جاف", "قلة الأمطار"],
];

const normalizeArabic = (text) => {
  return text
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .toLowerCase();
};

const HardFour = () => {
  const { correctAnswerSound, wrongAnswerSound } = useSound();

  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [next, setShowNext] = useState(false);

  const correctAnswer =
    "بعد المنطقة عن البحر وغياب الكتل الهوائية الرطبة مما يؤدي إلى الجفاف";

  // -----------------------------
  // Submit answer
  // -----------------------------
  const handleSubmit = () => {
    if (!text.trim()) return;

    const normalizedText = normalizeArabic(text);
    let matchedConcepts = 0;

    MAIN_CONCEPTS.forEach((conceptGroup) => {
      const found = conceptGroup.some((word) =>
        normalizedText.includes(normalizeArabic(word))
      );
      if (found) matchedConcepts++;
    });

    const percentage = Math.round(
      (matchedConcepts / MAIN_CONCEPTS.length) * 100
    );
    setScore(percentage);
    setIsSubmitted(true);

    if (percentage >= 66) {
      correctAnswerSound?.();
    } else {
      wrongAnswerSound?.();
    }
  };

  // -----------------------------
  // Retry button
  // -----------------------------
  const handleRetry = () => {
    setText("");
    setScore(0);
    setIsSubmitted(false);
  };

  // -----------------------------
  // Next button
  // -----------------------------
  const handleNext = () => setShowNext(true);

  // -----------------------------
  // Navigate to HardFive
  // -----------------------------
  if (next) return <HardFive />;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>لماذا تقل الأمطار جنوبًا؟</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="اكتب إجابتك هنا..."
        value={text}
        editable={!isSubmitted}
        onChangeText={setText}
      />

      {!isSubmitted && (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>إرسال</Text>
        </TouchableOpacity>
      )}

      {isSubmitted && (
        <View style={styles.resultBox}>
          <Text
            style={[
              styles.resultText,
              score >= 66 ? styles.correct : styles.wrong,
            ]}
          >
            التقييم: {score}%
          </Text>

          <Text style={styles.modelAnswerTitle}>نموذج الإجابة:</Text>
          <Text style={styles.modelAnswer}>{correctAnswer}</Text>

          {/* Retry & Next buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.retryButton]}
              onPress={handleRetry}
            >
              <Text style={styles.buttonText}>حاول مرة أخرى</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>التالي</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default HardFour;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  resultBox: {
    marginTop: 20,
  },

  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  correct: {
    color: "green",
  },

  wrong: {
    color: "red",
  },

  modelAnswerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },

  modelAnswer: {
    fontSize: 15,
    marginTop: 5,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  retryButton: {
    backgroundColor: "#f44336", 
    flex: 1,
    marginRight: 10,
  },

  nextButton: {
    backgroundColor: "#4CAF50", 
    flex: 1,
    marginLeft: 10,
  },
});
