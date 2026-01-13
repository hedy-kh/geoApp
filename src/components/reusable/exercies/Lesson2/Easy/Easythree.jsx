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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
      {...responder.panHandlers}
      style={[styles.dragItem, pan.getLayout()]}
    >
      <Text style={styles.dragText}>{label}</Text>
    </Animated.View>
  );
};

const Easythree = () => {
  const { winSound, correctAnswerSound, wrongAnswerSound } = useSound();

  const mapRef = useRef(null);
  const mapMetrics = useRef(null); // FIX

  const [placed, setPlaced] = useState({
    north: null,
    middle: null,
    south: null,
  });

  const [message, setMessage] = useState("");
  const [showNext, setShowNext] = useState(false);

  const terrain = ["جبال", "هضاب", "صحراء"];
  const hint = "فكر في موقع البحر والصحراء";

  // FIX: measure map in SCREEN coordinates
  const measureMap = () => {
    if (!mapRef.current) return;

    mapRef.current.measureInWindow((x, y, width, height) => {
      mapMetrics.current = { y, height };
    });
  };

  const handleDrop = (label, absoluteY) => {
    if (!mapMetrics.current) return;

    const { y, height } = mapMetrics.current;
    const relativeY = absoluteY - y;

    // STRICT bounds check
    if (relativeY < 0 || relativeY > height) {
      setMessage("⬅️ ضع العنصر داخل الخريطة");
      return;
    }

    const zoneHeight = height / 3;
    let droppedZone;

    if (relativeY < zoneHeight) droppedZone = "north";
    else if (relativeY < zoneHeight * 2) droppedZone = "middle";
    else droppedZone = "south";

    if (placed[droppedZone]) return;

    if (correctZones[label] === droppedZone) {
      correctAnswerSound();
      setPlaced((prev) => ({ ...prev, [droppedZone]: label }));
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
      <View
        ref={mapRef}
        style={styles.mapContainer}
        onLayout={measureMap} // FIX
      >
        <Image
          source={require("../../../../../../assets/images/maghreb.png")}
          style={styles.map}
        />

        {placed.north && (
          <Text style={[styles.icon, styles.north]}>
            {terrainIcons[placed.north]}
          </Text>
        )}
        {placed.middle && (
          <Text style={[styles.icon, styles.middle]}>
            {terrainIcons[placed.middle]}
          </Text>
        )}
        {placed.south && (
          <Text style={[styles.icon, styles.south]}>
            {terrainIcons[placed.south]}
          </Text>
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
    aspectRatio: 1.25, // BIGGER IMAGE
    position: "relative",
  },

  map: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  icon: {
    position: "absolute",
    fontSize: 40,
  },

  // YOUR OFFSET REQUEST (kept)
  north: {
    top: 10,
    left: "22%",
    transform: [{ translateX: -4 }, { translateY: 8 }],
  },

  middle: {
    top: "45%",
    left: "45%",
    transform: [{ translateX: 2 }, { translateY: 0 }],
  },

  south: {
    bottom: 10,
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
