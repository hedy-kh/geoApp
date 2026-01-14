import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import Svg, { Line } from "react-native-svg";
import useSound from "../../../../../hooks/useSound";
import MeduimFour from "./MeduimFour";

const quizz = [
  {
    terrain: "جبال",
    climate: "متوسطي",
    image: require("../../../../../../assets/images/atlas.jpg"),
  },
  {
    terrain: "هضاب",
    climate: "شبه جاف",
    image: require("../../../../../../assets/images/hadhba.png"),
  },
  {
    terrain: "صحراء",
    climate: "صحراوي",
    image: require("../../../../../../assets/images/sahara.jpg"),
  },
];

const shuffledImages = [...quizz].sort(() => Math.random() - 0.5);

const MeduimThree = () => {
  const { winSound, correctAnswerSound, wrongAnswerSound } = useSound();

  const [arrows, setArrows] = useState([]);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(false);
  const [next, showNext] = useState(false);

  // 🔴 VISUAL FIX STATES
  const [optionCenters, setOptionCenters] = useState({});
  const [imageCenters, setImageCenters] = useState({});

  const handleImagePress = (imageItem, imageIndex) => {
    if (!selectedTerrain) return;

    const terrainIndex = quizz.findIndex(
      (q) => q.terrain === selectedTerrain.terrain
    );

    const isCorrectMatch = selectedTerrain.climate === imageItem.climate;

    setArrows((prev) => [
      ...prev,
      {
        from: terrainIndex,
        to: imageIndex,
        correct: isCorrectMatch,
      },
    ]);

    if (isCorrectMatch) {
      correctAnswerSound?.();
      setMatched([...matched, selectedTerrain.terrain]);
      setSelectedTerrain(null);
      setWrong(false);

      if (matched.length + 1 === quizz.length) {
        winSound?.();
        setTimeout(() => showNext(true), 800);
      }
    } else {
      wrongAnswerSound?.();
      setWrong(true);

      setTimeout(() => {
        setArrows((prev) => prev.slice(0, -1));
      }, 1000);
    }
  };

  if (next) {
    return <MeduimFour />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اربط كل تضاريس بمناخه الصحيح</Text>

      <View style={styles.row}>
        {/* LEFT SIDE – OPTIONS */}
        <View style={styles.leftColumn}>
          {quizz.map((item, index) => (
            <TouchableOpacity
              key={index}
              disabled={matched.includes(item.terrain)}
              style={[
                styles.optionBox,
                selectedTerrain?.terrain === item.terrain && styles.selectedBox,
                matched.includes(item.terrain) && styles.correctBox,
              ]}
              onLayout={(e) => {
                const { y, height } = e.nativeEvent.layout;
                setOptionCenters((prev) => ({
                  ...prev,
                  [index]: y + height / 2,
                }));
              }}
              onPress={() => setSelectedTerrain(item)}
            >
              <Text style={styles.optionText}>{item.terrain}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SVG LINES */}
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          {arrows.map((arrow, index) => {
            const leftY = optionCenters[arrow.from];
            const rightY = imageCenters[arrow.to];

            if (!leftY || !rightY) return null;

            return (
              <Line
                key={index}
                x1={100} // right edge of option
                y1={leftY}
                x2={260} // left edge of image
                y2={rightY}
                stroke={arrow.correct ? "#2ecc71" : "#e74c3c"}
                strokeWidth={3}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>

        {/* RIGHT SIDE – IMAGES */}
        <View style={styles.rightColumn}>
          {shuffledImages.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageBox}
              onLayout={(e) => {
                const { y, height } = e.nativeEvent.layout;
                setImageCenters((prev) => ({
                  ...prev,
                  [index]: y + height / 2,
                }));
              }}
              onPress={() => handleImagePress(item, index)}
            >
              <Image source={item.image} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {wrong && <Text style={styles.wrongText}>❌ حاول مرة أخرى</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  row: {
    flex: 1,
    flexDirection: "row",
      justifyContent: 'space-between',
  },

  leftColumn: {
    justifyContent: "space-evenly",
    paddingLeft: 0,
  },

  rightColumn: {
    justifyContent: "space-evenly",
    paddingRight: 0,
  },

  optionBox: {
    width: 90,
    paddingVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },

  optionText: {
    fontSize: 14,
    fontWeight: "600",
  },

  selectedBox: {
    borderWidth: 2,
    borderColor: "#007bff",
  },

  correctBox: {
    backgroundColor: "#c8f7c5",
  },

  imageBox: {
    borderRadius: 10,
    overflow: "hidden",
  },

  image: {
    width: 120,
    height: 80,
    resizeMode: "cover",
  },

  wrongText: {
    textAlign: "center",
    color: "red",
    fontSize: 15,
    marginBottom: 15,
  },
});

export default MeduimThree;
