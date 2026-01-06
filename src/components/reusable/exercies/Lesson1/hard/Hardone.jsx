import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Svg, { Path, G } from "react-native-svg";
import useSound from "../../../../../hooks/useSound";
import Hardtwo from "./Hardtwo";

const Hardone = () => {
  const { winSound, wrongAnswerSound } = useSound();
  const [isCompleted, setIsCompleted] = useState(false);
  const [colored, setColored] = useState({
    TUNISIA: "#FFD700", 
  });
  const [showNext, setShowNext] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPath, setUserPath] = useState(["TUNISIA"]);

  const northAfricaCountries = [
    "MAURITANIA",
    "MOROCCO",
    "ALGERIA",
    "TUNISIA",
    "LIBYA",
  ];

  const travelPath = ["TUNISIA", "ALGERIA", "MOROCCO", "MAURITANIA"];

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        setShowNext(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  const onCountryPress = (country) => {
    if (northAfricaCountries.includes(country)) {
      if (country === travelPath[currentStep]) {
        setColored((prev) => ({
          ...prev,
          [country]: "#4CAF50",
        }));
        const newUserPath = [...userPath, country];
        setUserPath(newUserPath);
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        if (nextStep === travelPath.length) {
          winSound();
          setIsCompleted(true);
        }
      } else {
        wrongAnswerSound();

        setColored((prev) => ({
          ...prev,
          [country]: "#F44336",
        }));

        setTimeout(() => {
          setColored({ TUNISIA: "#FFD700" });
          setCurrentStep(0);
          setUserPath(["TUNISIA"]);
        }, 1000);
      }
    } else {
      wrongAnswerSound();
      setColored((prev) => ({
        ...prev,
        [country]: "#F44336",
      }));
      setTimeout(() => {
        setColored((prev) => {
          const updated = { ...prev };
          delete updated[country];
          return updated;
        });
      }, 500);
    }
  };

  const getInstructionText = () => {
    if (userPath.length === 1) {
      return "ميشيل في تونس يريد السفر إلى موريتانيا. اكتشف المسار الصحيح واضغط على الدول بالترتيب الصحيح.";
    } else if (userPath.length > 1 && !isCompleted) {
      const lastCountry = userPath[userPath.length - 1];
      return `ممتاز. أين تذهب بعد ذلك؟`;
    } else if (isCompleted) {
      return "🎉 أحسنت! لقد اكتشفت المسار الصحيح: تونس -الجزائر - المغرب - موريتانيا";
    }
    return "ميشيل في تونس يريد السفر إلى موريتانيا. اكتشف المسار الصحيح.";
  };

  if (showNext) {
    return <Hardtwo />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تمرين الرحلة</Text>
      <Text style={styles.instruction}>{getInstructionText()}</Text>

      

      <Svg width="100%" height={200} viewBox="850 200 400 300">
        <G>
          {/* TUNISIA - Starting point (always yellow) */}
          <Path
            d="M1048.2 289.1l-0.1 4.9-2.6 1.8-1.6 2.1-3.6 2.5 0.6 2.6-0.4 2.8-2.6 1.4-2.6-11.5-3.4-2.6-0.1-1.5-4.5-3.9-0.6-4.8 3.2-3.6 1.1-5.3-1-6.1 1-3.3 5.7-2.5 3.7 0.7 0 3.3 4.4-2.4 0.4 1.2-2.5 3.2 0.1 2.9 1.9 1.6-0.5 5.6-3.5 3.2 1.2 3.5 2.8 0.1 1.4 3.1 2.1 1z"
            fill={colored.TUNISIA || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => {
              if (currentStep === 0) {
                onCountryPress("TUNISIA");
              }
            }}
          />

          {/* LIBYA - Not in path but still clickable */}
          <Path
            d="M1122.6 299.1l-1.7 3.1 1 2.8-1.1 3.9 2 5.2 1.3 22.8 1 23.7 0.5 12.8-6.4 0 0 2.7-22.6-12.3-22.5-12.3-5.5 3.5-3.8 2.4-3.2-3.5-8.8-2.8-2.5-4-4.5-3-2.5 1.2-2.1-3.6-0.2-2.7-3.4-4.7 2.2-2.7-0.6-4 0.6-3.5-0.4-3 0.8-5.2-0.4-3-1.9-5.7 2.6-1.4 0.4-2.8-0.6-2.6 3.6-2.5 1.6-2.1 2.6-1.8 0.1-4.9 6.4 2.2 2.3-0.6 4.5 1.1 7.3 2.9 2.8 5.7 4.9 1.2 7.8 2.7 6 3.2 2.5-1.7 2.5-2.9-1.6-4.9 1.5-3.2 3.7-3 3.7-0.8 7.4 1.3 2 2.8 2 0.1 1.8 1.1 5.4 0.7 1.5 2.1z"
            fill={colored.LIBYA || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => onCountryPress("LIBYA")}
          />

          {/* ALGERIA - Second step in path */}
          <Path
            d="M1031 264.6l-1 3.3 1 6.1-1.1 5.3-3.2 3.6 0.6 4.8 4.5 3.9 0.1 1.5 3.4 2.6 2.6 11.5 1.9 5.7 0.4 3-0.8 5.2 0.4 3-0.6 3.5 0.6 4-2.2 2.7 3.4 4.7 0.2 2.7 2.1 3.6 2.5-1.2 4.5 3 2.5 4-18.8 12.3-16 12.6-7.8 2.8-6.2 0.7-0.1-4.1-2.6-1.1-3.5-1.8-1.3-3-18.7-14-18.6-14-20.5-15.6 0.1-1.2 0.1-0.4 0.1-7.6 8.9-4.8 5.4-1 4.5-1.7 2.1-3.2 6.4-2.5 0.3-4.8 3.1-0.6 2.5-2.3 7.1-1.1 1-2.5-1.4-1.4-1.9-6.8-0.3-3.9-1.9-4.1 5.1-3.5 5.8-1.1 3.3-2.6 5.1-2 9-1.1 8.8-0.5 2.7 0.9 4.9-2.5 5.7-0.1 2.2 1.5 3.6-0.4z"
            fill={colored.ALGERIA || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => onCountryPress("ALGERIA")}
          />

          {/* MOROCCO - Third step in path */}
          <Path
            d="M974.8 276l1.9 4.1 0.3 3.9 1.9 6.8 1.4 1.4-1 2.5-7.1 1.1-2.5 2.3-3.1 0.6-0.3 4.8-6.4 2.5-2.1 3.2-4.5 1.7-5.4 1-8.9 4.8-0.1 7.6-0.9 0 0.1 3.4-3.4 0.2-1.8 1.5-2.5 0-2-0.9-4.6 0.7-1.9 5-1.8 0.5-2.7 8.1-7.9 6.9-2 8.9-2.4 2.9-0.7 2.3-12.5 0.5-0.1 0 0.3-3 2.2-1.7 1.9-3.4-0.3-2.2 2-4.5 3.2-4.1 1.9-1 1.6-3.7 0.2-3.5 2.1-3.9 3.8-2.4 3.6-6.5 0.1-0.1 2.9-2.5 5.1-0.7 4.4-4.4 2.8-1.7 4.7-5.4-1.2-7.9 2.2-5.6 0.9-3.4 3.6-4.3 5.4-2.9 4.1-2.7 3.7-6.6 1.8-4 3.9 0.1 3.1 2.7 5.1-0.4 5.5 1.4 2.4 0z"
            fill={colored.MOROCCO || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => onCountryPress("MOROCCO")}
          />

          {/* MAURITANIA - Final destination */}
          <Path
            d="M959.2 341.5l-8.5 0.1 2.4 27.7 2.5 27.7 1 0.8-1.3 4.5-22.5 0.1-0.9 1.4-2.1-0.4-3.2 1.3-3.9-1.8-1.8 0.1-1 3.8-1.9 1.2-3.6-4.4-3.4-4.8-3.6-1.7-2.7-1.8-3.1 0-2.8 1.4-2.7-0.5-2 2-0.4-3.4 1.6-3.2 0.8-6-0.4-6.4-0.6-3.2 0.6-3.2-1.4-3-2.8-2.8 1.3-2.1 21.7 0-0.9-9.3 1.5-3.3 5.2-0.5 0.2-16.5 18 0.4 0.2-9.8 20.5 15.6z"
            fill={colored.MAURITANIA || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => onCountryPress("MAURITANIA")}
          />

          {/* EGYPT (Wrong answer) */}
          <Path
            d="M1172.1 301.4l3.9 9.4 0.7 1.6-1.3 2.6-0.7 4.8-1.2 3.4-1.2 1.1-2-2.1-2.7-2.8-4.7-9.2-0.5 0.6 2.8 6.7 3.9 6.5 4.9 10 2.3 3.5 2 3.6 5.4 7.1-1 1.1 0.4 4.2 6.8 5.8 1.1 1.3-22.1 0-21.5 0-22.3 0-1-23.7-1.3-22.8-2-5.2 1.1-3.9-1-2.8 1.7-3.1 7.2-0.1 5.4 1.7 5.5 1.9 2.6 1 4-2 2.1-1.8 4.7-0.6 3.9 0.8 1.8 3.2 1.1-2.1 4.4 1.5 4.3 0.4 2.5-1.6z"
            fill={colored.EGYPT || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => onCountryPress("EGYPT")}
          />

          {/* MALI (Wrong answer) */}
          <Path
            d="M1010.2 378.8l0.1 14.8-3.1 4.3-0.4 4-5 1-7.7 0.5-2 2.3-3.6 0.3-3.6 0-1.4-1.2-3.1 0.9-5.3 2.7-1.1 2-4.3 2.8-0.8 1.7-2.4 1.3-2.7-0.9-1.5 1.6-0.9 4.4-4.5 5.3 0.2 2.2-1.6 2.7 0.4 3.7-2.4 1-1.3 0.8-0.9-2.7-1.6 0.7-1-0.1-1 1.8-4.4 0-1.5-1-0.8 0.6-1.7-1.9 0.3-1.9-0.7-0.7-1.2 0.6 0.3-2.1 1.1-1.6-2.3-2.7-0.6-1.8-1.3-1.4-1.1-0.2-1.3 0.9-1.9 0.9-1.5 1.4-2.4-0.5-1.6-1.7-0.9-0.2-1.5 0.9-0.9 0-0.3-2.4 0.3-2-0.5-2.4-2-1.8-1.1-3.7-0.2-4 1.9-1.2 1-3.8 1.8-0.1 3.9 1.8 3.2-1.3 2.1 0.4 0.9-1.4 22.5-0.1 1.3-4.5-1-0.8-2.5-27.7-2.4-27.7 8.5-0.1 18.6 14 18.7 14 1.3 3 3.5 1.8 2.6 1.1 0.1 4.1 6.2-0.7z"
            fill={colored.MALI || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => onCountryPress("MALI")}
          />

          {/* NIGER (Wrong answer) */}
          <Path
            d="M1068.6 355l1.6 10 2.2 1.7 0.1 2 2.4 2.2-1.2 2.8-1.8 13-0.2 8.4-7 6-2.3 8.5 2.4 2.4 0 4.1 3.7 0.1-0.6 3.1-1.5 0.3-0.2 2.1-1 0.1-3.9-7-1.4-0.3-4.3 3.6-4.4-1.9-3-0.3-1.6 0.9-3.3-0.2-3.3 2.7-2.9 0.2-6.8-3.3-2.7 1.5-2.9-0.1-2.1-2.4-5.6-2.4-6.1 0.8-1.4 1.3-0.8 3.7-1.6 2.6-0.4 5.8-4.3-3.7-2 0-1.9 1.9 0.1-4.4-6.5-1.5-0.2-3.1-3.1-4.2-0.8-2.9 0.5-3.1 3.6-0.3 2-2.3 7.7-0.5 5-1 0.4-4 3.1-4.3-0.1-14.8 7.8-2.8 16-12.6 18.8-12.3 8.8 2.8 3.2 3.5 3.8-2.4z"
            fill={colored.NIGER || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => onCountryPress("NIGER")}
          />

          {/* CHAD (Wrong answer) */}
          <Path
            d="M1119.2 376.1l1.1 25.5-4.8-0.5-2.5 4.8-1.3 3.9 1.2 1.5-1.8 2 0.7 2.7-1.4 2.6-0.5 2.4 1.9-0.4 1.3 2.5 0.1 3.7 2.1 1.9 0 1.6-3.6 1.1-2.8 2.6-4 7-5.2 3-5.5-0.4-1.6 0.6 0.6 2.2-2.9 2.3-2.4 2.5-7.1 2.4-1.4-1.4-1-0.2-1 1.7-4.6 0.5 0.8-1.8-1.8-4.4-0.8-2.6-2.5-1.1-3.4-3.8 1.2-3 2.6 0.6 1.6-0.4 3.2 0-3.2-5.8 0.2-4.3-0.5-4.2-2.3-4.1 0.6-3.1-3.7-0.1 0-4.1-2.4-2.4 2.3-8.5 7-6 0.2-8.4 1.8-13 1.2-2.8-2.4-2.2-0.1-2-2.2-1.7-1.6-10 5.5-3.5 22.5 12.3 22.6 12.3z"
            fill={colored.CHAD || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => onCountryPress("CHAD")}
          />

          {/* SUDAN (Wrong answer) */}
          <Path
            d="M1191 409.2l-0.7 5.5-2 6.4-3.3 3.1-2.3 5-0.5 2.6-2.6 1.8-1.5 6.7 0 0.8-0.8-0.2 0.1-3.2-0.8-2.2-2.9-2.5-0.9-4.6 0.6-4.8-2.6-0.4-0.4 1.4-3.4 0.4 1.5 1.8 0.5 3.9-3 3.5-2.7 4.6-2.9 0.7-4.8-3.7-2.1 1.3-0.5 1.8-2.9 1.3-0.2 1.3-5.6 0-0.8-1.3-4.1-0.3-2 1.1-1.6-0.5-2.9-3.8-1-1.7-4.1 0.9-1.5 2.9-1.3 5.8-2 1.2-1.7 0.7-0.5-0.3-1.9-1.9-0.4-2 0.8-2.6 0-2.7-3.3-4-0.7-2.7 0-1.6-2.1-1.9-0.1-3.7-1.3-2.5-1.9 0.4 0.5-2.4 1.4-2.6-0.7-2.7 1.8-2-1.2-1.5 1.3-3.9 2.5-4.8 4.8 0.5-1.1-25.5 0-2.7 6.4 0-0.5-12.8 22.3 0 21.5 0 22.1 0 2.1 6.3-1.2 1.1 1.2 6.7 2.5 7.6 2.2 1.6 3.2 2.4-2.7 3.6-4 1.1-1.7 2-0.3 4.2-2 9.5 0.7 2.5z"
            fill={colored.SUDAN || "#ddd"}
            stroke="#333"
            strokeWidth="1.5"
            onPress={() => onCountryPress("SUDAN")}
          />
        </G>
      </Svg>

      {isCompleted && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            🎉 أحسنت! لقد اكتشفت المسار الصحيح
          </Text>
          <Text style={styles.finalPath}>
            تونس → الجزائر → المغرب → موريتانيا
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2C3E50",
  },
  instruction: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#34495E",
    lineHeight: 26,
  },
  pathText: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2980B9",
    marginBottom: 15,
  },
  successContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27AE60",
    textAlign: "center",
  },
  finalPath: {
    fontSize: 18,
    color: "#2C3E50",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});

export default Hardone;
