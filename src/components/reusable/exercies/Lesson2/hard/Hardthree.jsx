import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import useSound from "../../../../../hooks/useSound";
import HardFour from "./HardFour";

const quizz = [
  {
    option: "توسع المدن",
    answer: false,
  },
  {
    option: "الرعي المفرط",
    answer: true,
  },
  {
    option: "الأمطار الغزيرة",
    answer: false,
  },
];

const Hardthree = () => {
  const { arabSound, wrongAnswerSound } = useSound();

  const [correct, setIsCorrect] = useState(null);
  const [isCompleted, setCompleted] = useState(false);
  const [next, setShowNext] = useState(false);

  const handlePress = (item) => {
    if (item.answer) {
      arabSound?.();
      setIsCorrect(true);
      setCompleted(true);
    } else {
      wrongAnswerSound?.();
      setIsCorrect(false);
    }
  };

  const handleMessage = () => {
    if (correct === true) {
      return "إجابة صحيحة";
    }
    if (correct === false) {
      return "حاول مجددا";
    }
    return "";
  };

  useEffect(() => {
    if (isCompleted) {
      const t = setTimeout(() => {
        setShowNext(true);
      }, 3800);
      return () => clearTimeout(t);
    }
  }, [isCompleted]);

  if (next) {
    return <HardFour />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        عليّ ذهب لجمع نباتات لكنه لم يجد ما يكفي
      </Text>

      <Image
        style={[
          styles.image,
          correct === true && styles.correctImage,
        ]}
        source={require("../../../../../../assets/images/forestnotrees.jpg")}
      />

      <Text style={styles.subtitle}>ما السبب؟</Text>

      {quizz.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          disabled={isCompleted}
          onPress={() => handlePress(item)}
        >
          <Text style={styles.optionText}>{item.option}</Text>
        </TouchableOpacity>
      ))}

      {correct !== null && (
        <Text
          style={[
            styles.feedback,
            correct ? styles.correctText : styles.wrongText,
          ]}
        >
          {handleMessage()}
        </Text>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },

  image: {
    width: 260,
    height: 180,
    resizeMode: "cover",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "transparent",
    marginBottom: 15,
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

  feedback: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
  },

  correctText: {
    color: "green",
  },

  wrongText: {
    color: "red",
  },
});


export default Hardthree