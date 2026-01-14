import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import useSound from "../../../../../hooks/useSound";
import MeduimFive from "./MeduimFive";

const quizz = [
  {
    city: "الجزائر العاصمة",
    temp: "12°",
    answer: false,
  },
  {
    city: "سطيف",
    temp: "18°",
    answer: false,
  },
  {
    city: "توغرت",
    temp: "28°",
    answer: true,
  },
];

const MeduimFour = () => {
  const { winSound, correctAnswerSound, wrongAnswerSound } = useSound();

  const [isCorrect, setIsCorrect] = useState(null);
  const [isCompleted, setCompleted] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const handlePress = (item) => {
    if (item.answer) {
      correctAnswerSound();
      setIsCorrect(true);
      setCompleted(true);
    } else {
      wrongAnswerSound?.();
      setIsCorrect(false);
    }
  };

  const handleMessage = () => {
    if (isCorrect === true) {
      return "إجابة صحيحة: لأنها صحراء وبعيدة عن البحر";
    }
    if (isCorrect === false) {
      return "تلميح: تذكر موقع المدينة وتأثير البحر";
    }
    return "";
  };

  useEffect(() => {
    if (isCompleted) {
      winSound?.();
      const t = setTimeout(() => setShowNext(true), 2000);
      return () => clearTimeout(t);
    }
  }, [isCompleted]);

  if (showNext) return <MeduimFive />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>أي مدينة أكثر حرارة ولماذا؟ </Text>

      <Image
        style={[styles.image, isCorrect === true && styles.correctImage]}
        source={require("../../../../../../assets/images/toughart.png")}
      />

      {quizz.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          disabled={isCompleted}
          onPress={() => handlePress(item)}
        >
          <Text style={styles.optionText}>
            {item.city} — {item.temp}
          </Text>
        </TouchableOpacity>
      ))}

      {isCorrect !== null && (
        <Text
          style={[
            styles.feedbackText,
            isCorrect ? styles.correctText : styles.wrongText,
          ]}
        >
          {handleMessage()}
        </Text>
      )}

      {isCompleted && <Text style={styles.successText}>🎉 أحسنت</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    paddingHorizontal: 10,
  },

  image: {
    width: 260,
    height: 180,
    resizeMode: "contain",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "transparent",
    marginBottom: 20,
  },

  correctImage: {
    borderColor: "green",
  },

  option: {
    width: "80%",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginVertical: 6,
    alignItems: "center",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },

  feedbackText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
  },

  correctText: {
    color: "green",
  },

  wrongText: {
    color: "red",
  },

  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
    textAlign: "center",
  },
});

export default MeduimFour;
