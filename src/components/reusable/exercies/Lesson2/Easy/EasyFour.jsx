import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import useSound from "../../../../../hooks/useSound";

const quizz = [
  {
    image: require("../../../../../../assets/images/atlas.jpg"),
    choices: ["جبل", "هضبة", "صحراء"],
    correct: "جبل",
  },
  {
    image: require("../../../../../../assets/images/hadhba.png"),
    choices: ["جبل", "هضبة"],
    correct: "هضبة",
  },
  {
    image: require("../../../../../../assets/images/sahara.jpg"),
    choices: ["صحراء", "جبل"],
    correct: "صحراء",
  },
];

const EasyFour = () => {
  const { winSound, correctAnswerSound, wrongAnswerSound } = useSound();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isCompleted, setCompleted] = useState(false);

  const currentQuestion = quizz[currentIndex];

  const handleAnswer = (choice) => {
    if (choice === currentQuestion.correct) {
      setIsCorrect(true);
      correctAnswerSound?.();

      setTimeout(() => {
        if (currentIndex === quizz.length - 1) {
          setCompleted(true);
          winSound?.();
        } else {
          setCurrentIndex((prev) => prev + 1);
          setIsCorrect(null);
        }
      }, 800);
    } else {
      setIsCorrect(false);
      wrongAnswerSound?.();
    }
  };

  if (isCompleted) {
    return (
      <View>
        <Text style={styles.successText}>🎉 أحسنت! أنهيت التمرين</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر نوع التضاريس في الصورة</Text>

      <Image
        source={currentQuestion.image}
        style={[styles.image, isCorrect === true && styles.correctImage]}
      />

      <View style={styles.choicesContainer}>
        {currentQuestion.choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={styles.choiceButton}
            onPress={() => handleAnswer(choice)}
          >
            <Text style={styles.choiceText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isCorrect === false && (
        <Text style={styles.wrongText}>حاول مرة أخرى</Text>
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  image: {
    width: 260,
    height: 180,
    resizeMode: "cover",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "transparent",
    marginBottom: 20,
  },

  correctImage: {
    borderColor: "green",
  },

  choicesContainer: {
    width: "100%",
    alignItems: "center",
  },

  choiceButton: {
    width: "80%",
    padding: 14,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginVertical: 6,
    alignItems: "center",
  },

  choiceText: {
    fontSize: 18,
    fontWeight: "600",
  },

  wrongText: {
    marginTop: 10,
    color: "red",
    fontSize: 16,
  },

  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginTop: 50,
  },
});

export default EasyFour;
