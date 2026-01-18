import React, { useState } from "react";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroDirectionalLight,
  Viro3DObject,
  ViroNode,
  ViroAmbientLight,
} from "@reactvision/react-viro";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";

/* ============ AR SCENE (CLEAN + STABLE + ZOOM BUTTONS) ============ */
const ARScene = (props) => {
  const { selectedModel } = props.sceneNavigator.viroAppProps;
  const [mapLoaded, setMapLoaded] = useState(false);

  const [position, setPosition] = useState([0, -0.3, -2]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [scale, setScale] = useState([0.7, 0.7, 0.7]);

  const clampRotation = (rot) => {
    if (!Array.isArray(rot) || rot.length !== 3) return rotation;
    return [Math.max(-45, Math.min(45, rot[0])), rot[1] || 0, 0];
  };

  const safeScale = (s) => {
    if (!Array.isArray(s) || s.length !== 3) return scale;
    const newScale = 0.7 * s[0];
    return [
      Math.max(0.3, Math.min(1.5, newScale)),
      Math.max(0.3, Math.min(1.5, newScale)),
      Math.max(0.3, Math.min(1.5, newScale)),
    ];
  };

  const zoomIn = () => {
    const newScale = Math.min(1.5, scale[0] * 1.2);
    setScale([newScale, newScale, newScale]);
  };

  const zoomOut = () => {
    const newScale = Math.max(0.3, scale[0] * 0.8);
    setScale([newScale, newScale, newScale]);
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={400} />
      <ViroDirectionalLight direction={[0, -1, -0.5]} intensity={300} />

      {/* SIMPLE ENGLISH LABEL ONLY */}
      <ViroText
        text="GeoKids"
        position={[0, 1.2, -3]}
        scale={[0.8, 0.8, 0.8]}
        style={styles.arText}
      />

      {/* ======= ZOOM BUTTONS INSIDE AR ======= */}
      <ViroText
        text="+"
        position={[-0.8, 0.8, -2]}
        scale={[1, 1, 1]}
        style={styles.zoomButton}
        onClick={zoomIn}
      />

      <ViroText
        text="−"
        position={[0.8, 0.8, -2]}
        scale={[1, 1, 1]}
        style={styles.zoomButton}
        onClick={zoomOut}
      />

      <ViroNode
        position={position}
        rotation={rotation}
        scale={scale}
        dragType="FixedToWorld"
        onDrag={(pos) => setPosition(pos)}
        onRotate={(rot) => setRotation(clampRotation(rot))}
        onPinch={(s) => setScale(safeScale(s))}
      >
        <Viro3DObject
          source={selectedModel}
          type="GLB"
          scale={[1, 1, 1]}
          position={[0, 0, 0]}
          onLoadStart={() => console.log("Loading model...")}
          onLoadEnd={() => setMapLoaded(true)}
          onError={(e) => console.error("Model error:", e)}
        />
      </ViroNode>
    </ViroARScene>
  );
};

/* ============ MAIN SCREEN (UNCHANGED STRUCTURE) ============ */
export default function StudentARScreen({ route }) {
  const { arView } = route.params;

  const [selectedModel, setSelectedModel] = useState(
    require("../../../../assets/3d/africa_3d_map.glb"),
  );

  const MODELS = [
    {
      id: "africa",
      label: "خريطة إفريقيا ",
      source: require("../../../../assets/3d/africa_3d_map.glb"),
    },
    {
      id: "clock",
      label: "برج الساعة",
      source: require("../../../../assets/3d/tunis_tower_clock__av._habib_bourghiba.glb"),
    },
    {
      id: "coliseum",
      label: "مدرج الجم",
      source: require("../../../../assets/3d/coliseum_rome.glb"),
    },
    {
      id: "tatoui",
      label: "تطاوين",
      source: require("../../../../assets/3d/mos_espa_-_starwars_tunisia_film_location.glb"),
    },
    {
      id: "douga",
      label: "الموقع الأثري لدُقّة",
      source: require("../../../../assets/3d/hierapolis_theatre_-_turkey.glb"),
    },
    {
      id: "sbeitla",
      label: "سبيطلة",
      source: require("../../../../assets/3d/poseidon_temple_at_sounion_greece.glb"),
    },
    {
      id: "zaghouan",
      label: "زغوان",
      source: require("../../../../assets/3d/london_roman_wall_at_tower_hill.glb"),
    },
    {
      id: "carthage",
      label: "قرطاج",
      source: require("../../../../assets/3d/terme_del_bacucco_-_ruins_of_bacuccos_thermae.glb"),
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        initialScene={{ scene: ARScene }}
        viroAppProps={{ selectedModel, arView }}
        autofocus={true}
        style={{ flex: 1 }}
      />

      {/* BOTTOM HORIZONTAL MENU */}
      <View style={styles.bottomBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MODELS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.modelButton}
              onPress={() => {
                console.log("Switching to:", item.label);
                setSelectedModel(item.source);
              }}
            >
              <Text style={styles.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

/* ============ STYLES ============ */
const styles = StyleSheet.create({
  arText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
  },

  zoomButton: {
    fontSize: 40,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    textAlign: "center",
  },

  bottomBar: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    padding: 10,
  },

  modelButton: {
    backgroundColor: "#1e90ff",
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
