import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import EasyFour from "./EasyFour";
import useSound from "../../../../../hooks/useSound";

const correctZones = {
  جبال: "north",
  هضاب: "middle",
  صحراء: "south",
};

const terrainIcons = {
  جبال: "⛰️",
  هضاب: "🌄",
  صحراء: "🏜️",
};

const DraggableItem = ({ label, onDrop }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gesture) => {
      onDrop(label, gesture.moveY);
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <Animated.View
      style={[styles.dragItem, { transform: pan.getTranslateTransform() }]}
      {...responder.panHandlers}
    >
      <Text style={styles.dragText}>{label}</Text>
    </Animated.View>
  );
};

const Easythree = () => {
  const { winSound, correctAnswerSound, wrongAnswerSound } = useSound();
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const imageRef = useRef(null);
  const imageMetrics = useRef(null);

  const [placed, setPlaced] = useState({
    north: null,
    middle: null,
    south: null,
  });
  const [message, setMessage] = useState("");
  const [showNext, setShowNext] = useState(false);

  const terrain = ["جبال", "هضاب", "صحراء"];
  const hint = "فكر في موقع البحر والصحراء";

  const measureImage = () => {
    if (!imageRef.current) return;
    imageRef.current.measureInWindow((x, y, width, height) => {
      imageMetrics.current = { y, height };
      console.log("Image metrics:", { y, height }); // Debug log
    });
  };

  const handleDrop = (label, absoluteY) => {
    if (!imageMetrics.current) return;

    const { y, height } = imageMetrics.current;
    const relativeY = absoluteY - y;

    console.log("Drop:", { label, absoluteY, imageY: y, relativeY, height }); // Debug log

    if (relativeY < 0 || relativeY > height) {
      setMessage("⬅️ ضع العنصر داخل الخريطة");
      return;
    }

    // Calculate relative position as percentage (0 to 1)
    const relativePosition = relativeY / height;

    let droppedZone;

    if (relativePosition < 0.25) {
      droppedZone = "north";
    } else if (relativePosition > 0.6) {
      droppedZone = "south";
    } else {
      droppedZone = "middle";
    }

    console.log(
      "Detected zone:",
      droppedZone,
      "for",
      label,
      "position:",
      relativePosition
    );

    if (placed[droppedZone]) {
      setMessage("⚠️ هذه المنطقة ممتلئة بالفعل");
      return;
    }

    if (correctZones[label] === droppedZone) {
      correctAnswerSound();
      setPlaced((prev) => ({
        ...prev,
        [droppedZone]: label,
      }));
      setMessage("⭐ صحيح!");
    } else {
      wrongAnswerSound();
      setMessage(hint);
    }
  };

  const allPlaced = placed.north && placed.middle && placed.south;

  useEffect(() => {
    if (allPlaced) {
      winSound();
      const t = setTimeout(() => setShowNext(true), 2000);
      return () => clearTimeout(t);
    }
  }, [allPlaced]);

  if (showNext) return <EasyFour />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        اسحب اسم التضاريس وضعه على المكان الصحيح على الخريطة
      </Text>

      {/* MAP */}
      <View style={styles.mapContainer}>
        <Image
          ref={imageRef}
          source={require("../../../../../../assets/images/maghreb.png")}
          style={styles.map}
          onLayout={measureImage}
        />

        {placed.north && (
          <View style={[styles.iconContainer, styles.north]}>
            <Text style={styles.icon}>{terrainIcons[placed.north]}</Text>
          </View>
        )}

        {placed.middle && (
          <View style={[styles.iconContainer, styles.middle]}>
            <Text style={styles.icon}>{terrainIcons[placed.middle]}</Text>
          </View>
        )}

        {placed.south && (
          <View style={[styles.iconContainer, styles.south]}>
            <Text style={styles.icon}>{terrainIcons[placed.south]}</Text>
          </View>
        )}
      </View>

      {/* DRAG ITEMS */}
      <View style={styles.dragContainer}>
        {terrain
          .filter((t) => !Object.values(placed).includes(t))
          .map((item) => (
            <DraggableItem key={item} label={item} onDrop={handleDrop} />
          ))}
      </View>

      <Text style={styles.subtitle}>{message}</Text>
      {allPlaced && <Text style={styles.successText}>🎉 إجابة صحيحة</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  mapContainer: {
    width: "100%",
    aspectRatio: 1.18,
    position: "relative",
    height: "50%",
  },
  map: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  iconContainer: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: "#4CAF50",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 20,
  },
  north: {
    top: 30,
    left: "42%",
    transform: [{ translateX: -4 }, { translateY: 8 }],
  },
  middle: {
    top: "30%", // Moved higher from 45%
    left: "50%", // Moved more to the right from 45%
    transform: [{ translateX: 2 }, { translateY: 0 }],
  },
  south: {
    bottom: "25%", // Moved higher from bottom: 10
    left: "55%",
    transform: [{ translateX: 4 }, { translateY: -5 }],
  },
  dragContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  dragItem: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    elevation: 3,
  },
  dragText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  successText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});

export default Easythree;
