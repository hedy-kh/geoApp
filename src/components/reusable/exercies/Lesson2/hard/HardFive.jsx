import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import useSound from "../../../../../hooks/useSound";
import { useState, useEffect } from "react";

const quizz = [
  {
    option: "غلق الصنبور",
    imagepath: require("../../../../../../assets/images/closingtap.jpg"),
    correct: true,
  },
  {
    option: "تبذير الماء",
    imagepath: require("../../../../../../assets/images/tabdhir.jpg"),
    correct: false,
  },
  {
    option: "زرع الأشجار",
    imagepath: require("../../../../../../assets/images/zaraa.jpg"),
    correct: true,
  },
];

const HardFive = () => {
  const { winSound, wrongAnswerSound, arabicSound } = useSound();

  // Add debug logs
  console.log("Sound functions:", { winSound, wrongAnswerSound, arabicSound });

  const [selected, setSelected] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [allCorrectSelected, setAllCorrectSelected] = useState(false);

  useEffect(() => {
    if (allCorrectSelected) {
      console.log("Playing arabic sound");
      arabicSound();

      const timer = setTimeout(() => {
        setShowCompletion(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [allCorrectSelected]);

  const handlePress = (index) => {
    console.log("Button pressed, index:", index);

    if (selected.includes(index)) {
      console.log("Already selected, returning");
      return;
    }

    const item = quizz[index];
    console.log("Item:", item, "Correct:", item.correct);

    // Play sound BEFORE updating state
    if (item.correct) {
      console.log("Calling winSound");
      winSound();
    } else {
      console.log("Calling wrongAnswerSound");
      wrongAnswerSound();
    }

    // Then update state
    const newSelected = [...selected, index];
    setSelected(newSelected);

    const correctIndexes = quizz
      .map((q, i) => (q.correct ? i : null))
      .filter((i) => i !== null);

    const allCorrectNow = correctIndexes.every((i) => newSelected.includes(i));

    if (allCorrectNow) {
      console.log("All correct answers selected!");
      setAllCorrectSelected(true);
    }
  };

  if (showCompletion) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          أحسنت، أنت مستكشف المغرب العربي الصغير!
        </Text>
        <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        اختر الصور التي تمثل سلوكيات صحيحة للحفاظ على الماء
      </Text>

      {quizz.map((item, index) => {
        const isSelected = selected.includes(index);
        const borderColor =
          isSelected && item.correct
            ? "green"
            : isSelected && !item.correct
            ? "red"
            : "#ccc";

        return (
          <TouchableOpacity
            key={index}
            style={[styles.option, { borderColor }]}
            onPress={() => handlePress(index)}
            disabled={allCorrectSelected}
          >
            <Image source={item.imagepath} style={styles.image} />
            <Text style={styles.optionText}>{item.option}</Text>
          </TouchableOpacity>
        );
      })}

      {allCorrectSelected && !showCompletion && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HardFive;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  option: {
    width: 250,
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 12,
    marginVertical: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 150,
    resizeMode: "cover",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 5,
    textAlign: "center",
  },
  stars: {
    fontSize: 28,
    marginTop: 20,
  },
  loadingContainer: {
    marginTop: 20,
    padding: 10,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
