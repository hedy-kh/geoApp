import React, { useState, useRef } from "react";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroDirectionalLight,
  Viro3DObject,
  ViroNode,
  ViroAmbientLight,
} from "@reactvision/react-viro";
import { StyleSheet } from "react-native";

const ARScene = (props) => {
  const { arView } = props.sceneNavigator.viroAppProps;
  const [mapLoaded, setMapLoaded] = useState(false);
  const worldmap = '../../../../assets/3d/worldmap.glb';
  
  // Use refs for position/rotation to avoid re-renders
  const mapPosition = useRef([0, 0, -2]); // 2 meters in front of camera
  const mapRotation = useRef([-15, 0, 0]); // Slightly tilted forward for better viewing
  const mapScale = useRef([0.7, 0.7, 0.7]); // Initial scale

  // Debug handlers
  const handleMapLoadStart = () => {
    console.log("🗺️ جاري تحميل خريطة أفريقيا...");
  };

  const handleMapLoadEnd = () => {
    console.log("✅ تم تحميل الخريطة بنجاح!");
    setMapLoaded(true);
  };

  const handleMapError = (error) => {
    console.error("❌ خطأ في تحميل الخريطة:", error);
  };

  const handleMapDrag = (position, source) => {
    console.log("🗺️ تم نقل الخريطة إلى:", position);
    mapPosition.current = position;
  };

  const handleMapRotate = (rotation, source) => {
    console.log("🔄 تم تدوير الخريطة:", rotation);
    // Ensure rotation values are valid
    if (
      rotation &&
      Array.isArray(rotation) &&
      rotation.length === 3 &&
      rotation.every((val) => !isNaN(val))
    ) {
      mapRotation.current = rotation;
    }
  };

  const handleMapPinch = (scale, source) => {
    console.log("🔍 تم تغيير حجم الخريطة:", scale);
    if (scale && Array.isArray(scale) && scale.length === 3) {
      // Apply the pinch scale to the base scale
      mapScale.current = [0.7 * scale[0], 0.7 * scale[1], 0.7 * scale[2]];
    }
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

      {/* Floating title in Arabic */}
      <ViroText
        text={arView?.name || "خريطة أفريقيا التفاعلية"}
        position={[0, 1, -3]}
        scale={[0.8, 0.8, 0.8]}
        style={styles.titleText}
      />

      {/* Loading status */}
      {!mapLoaded && (
        <ViroText
          text="جاري تحميل الخريطة ثلاثية الأبعاد..."
          position={[0, 0, -2]}
          scale={[0.7, 0.7, 0.7]}
          style={styles.loadingText}
        />
      )}

      {/* Instructions */}
      <ViroText
        text="يمكنك سحب، تدوير، وتكبير/تصغير الخريطة"
        position={[0, 0.5, -3]}
        scale={[0.6, 0.6, 0.6]}
        style={styles.instructionText}
      />

      {/* Map container with drag, rotate, and pinch capabilities */}
      <ViroNode
        position={mapPosition.current}
        rotation={mapRotation.current}
        scale={mapScale.current}
        dragType="FixedToWorld"
        onDrag={handleMapDrag}
        onRotate={handleMapRotate}
        onPinch={handleMapPinch}
      >
        {/* ============ AFRICA MAP 3D MODEL ============ */}
        <Viro3DObject
          source={require("../../../../assets/3d/africa_3d_map.glb")}
          type="GLB"
          scale={[1, 1, 1]}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          onLoadStart={handleMapLoadStart}
          onLoadEnd={handleMapLoadEnd}
          onError={handleMapError}
        />
      </ViroNode>
    </ViroARScene>
  );
};

// Styles
const styles = StyleSheet.create({
  titleText: {
    fontFamily: "Arial",
    fontSize: 24,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  instructionText: {
    fontFamily: "Arial",
    fontSize: 16,
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
