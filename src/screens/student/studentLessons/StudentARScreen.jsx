import React, { useState } from "react";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroDirectionalLight,
  Viro3DObject,
  ViroNode,
  ViroARPlaneSelector,
  ViroAmbientLight,
  ViroBox,
} from "@reactvision/react-viro";
import { StyleSheet } from "react-native";

/* COUNTRY ANCHORS (relative to the placed model) */
const COUNTRY_POINTS = {
  Tunisia: [0.2, 0.02, 0],
  Algeria: [0.0, 0.02, 0],
  Libya: [0.35, 0.02, 0],
  Morocco: [-0.25, 0.02, 0],
  Mauritania: [-0.4, 0.02, 0],
};

const ARScene = (props) => {
  const { arView } = props.sceneNavigator.viroAppProps;
  const [travelerPos, setTravelerPos] = useState(COUNTRY_POINTS.Tunisia);
  const [planeFound, setPlaneFound] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [characterLoaded, setCharacterLoaded] = useState(false);

  // Debug handlers
  const handleMapLoadStart = () => {
    console.log("🗺️ Map model loading...");
  };

  const handleMapLoadEnd = () => {
    console.log("✅ Map model loaded successfully!");
    setMapLoaded(true);
  };

  const handleMapError = (error) => {
    console.error("❌ Map model error:", error);
  };

  const handleCharacterLoadStart = () => {
    console.log("🚶 Character model loading...");
  };

  const handleCharacterLoadEnd = () => {
    console.log("✅ Character model loaded successfully!");
    setCharacterLoaded(true);
  };

  const handleCharacterError = (error) => {
    console.error("❌ Character model error:", error);
  };

  const handleCountryTap = (countryName) => {
    console.log(`📍 Tapped on ${countryName}`);
    setTravelerPos(COUNTRY_POINTS[countryName]);
  };

  return (
    <ViroARScene>
      {/* Lighting setup */}
      <ViroAmbientLight color="#ffffff" intensity={400} />
      <ViroDirectionalLight
        direction={[0, -1, -0.5]}
        color="#ffffff"
        intensity={300}
      />

      {/* Floating title */}
      <ViroText
        text={arView?.name || "Scan a surface to place the map"}
        position={[0, 0.5, -1.5]}
        scale={[1, 1, 1]}
        style={styles.titleText}
      />

      {/* Instructions before plane is found */}
      {!planeFound && (
        <ViroText
          text="Move your phone slowly to detect a surface..."
          position={[0, 0.3, -1.5]}
          scale={[1, 1, 1]}
          style={styles.instructionText}
        />
      )}

      {/* Loading status */}
      {planeFound && (!mapLoaded || !characterLoaded) && (
        <ViroText
          text="Loading 3D models..."
          position={[0, 0.2, -1.5]}
          scale={[1, 1, 1]}
          style={styles.loadingText}
        />
      )}

      {/* AR Plane Selector - places content on detected surface */}
      <ViroARPlaneSelector
        minHeight={0.3}
        minWidth={0.3}
        alignment="Horizontal"
        onPlaneSelected={() => {
          console.log("✅ Plane detected and selected!");
          setPlaneFound(true);
        }}
      >
        <ViroNode position={[0, 0, 0]}>
          {/* ============ AFRICA MAP 3D MODEL ============ */}
          {/* ============ AFRICA MAP 3D MODEL ============ */}
          <Viro3DObject
            source={require("../../../../assets/3d/africa_3d_map.glb")}
            type="GLB"
            scale={[0.5, 0.5, 0.5]}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            onLoadStart={handleMapLoadStart}
            onLoadEnd={handleMapLoadEnd}
            onError={handleMapError}
          />

          {/* DEBUG: Add a visible box behind the map */}
          <ViroBox
            position={[0, 0.05, 0]}
            scale={[0.5, 0.01, 0.5]}
            materials={["blue"]}
          />

          {/* ============ COUNTRY INTERACTION POINTS ============ */}
          {Object.entries(COUNTRY_POINTS).map(([name, pos]) => (
            <ViroNode
              key={name}
              position={pos}
              onClick={() => handleCountryTap(name)}
            >
              {/* Country label */}
              <ViroText
                text={name}
                position={[0, 0.1, 0]}
                scale={[1, 1, 1]}
                style={styles.countryLabel}
              />

              {/* Interactive marker (shows where to tap) */}
              <ViroBox
                position={[0, 0.05, 0]}
                scale={[0.03, 0.02, 0.03]}
                materials={["green"]}
              />
            </ViroNode>
          ))}

          {/* ============ CHARACTER 3D MODEL ============ */}
          <Viro3DObject
            source={require("../../../../assets/3d/charachter_model.glb")}
            type="GLB"
            scale={[0.08, 0.08, 0.08]}
            position={travelerPos}
            rotation={[0, 0, 0]}
            onLoadStart={handleCharacterLoadStart}
            onLoadEnd={handleCharacterLoadEnd}
            onError={handleCharacterError}
            animation={{
              name: "idle",
              run: true,
              loop: true,
            }}
          />

          {/* Character fallback indicator */}
          {/* <ViroBox
            position={travelerPos}
            scale={[0.05, 0.1, 0.05]}
            materials={["red"]}
          /> */}
        </ViroNode>
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

// Styles for ViroText
const styles = StyleSheet.create({
  titleText: {
    fontFamily: "Arial",
    fontSize: 28,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  instructionText: {
    fontFamily: "Arial",
    fontSize: 20,
    color: "#ffcc00",
    textAlignVertical: "center",
    textAlign: "center",
  },
  loadingText: {
    fontFamily: "Arial",
    fontSize: 18,
    color: "#00ffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  countryLabel: {
    fontFamily: "Arial",
    fontSize: 16,
    color: "#00ff00",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
});

/* ============ MAIN SCREEN COMPONENT ============ */
export default function StudentARScreen({ route }) {
  const { arView } = route.params;

  return (
    <ViroARSceneNavigator
      initialScene={{ scene: ARScene }}
      viroAppProps={{ arView }}
      autofocus={true}
      style={{ flex: 1 }}
    />
  );
}
