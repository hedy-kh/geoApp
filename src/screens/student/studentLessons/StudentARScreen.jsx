// import React from "react";
// import {
//   ViroARSceneNavigator,
//   ViroARScene,
//   ViroText,
//   ViroDirectionalLight,
//   ViroImage,
// } from "@reactvision/react-viro";

// const ARScene = (props) => {
//   const { arView } = props.sceneNavigator.viroAppProps;

//   return (
//     <ViroARScene>
//       <ViroDirectionalLight color="#ffffff" direction={[0, -1, 0]} />

//       <ViroText
//         text={arView?.name || "No name"}
//         position={[0, 0, -1]}
//         style={{ fontSize: 30, color: "white" }}
//       />

//       {arView?.type === "3d_model" && (
//         <ViroImage
//           source={require("../../../../assets/images/atlas.jpg")}
//           position={[0, -0.5, -1]}
//           scale={[0.5, 0.5, 0.5]}
//         />
//       )}
//     </ViroARScene>
//   );
// };

// export default function StudentARScreen({ route }) {
//   const { arView } = route.params;

//   return (
//     <ViroARSceneNavigator
//       initialScene={{ scene: ARScene }}
//       viroAppProps={{ arView }}
//       autofocus
//     />
//   );
// }

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { Camera } from "expo-camera";
// import { WebView } from "react-native-webview";

// const arImage = require("../../../../assets/images/africamap.jpg");

// export default function StudentARScreen({ route }) {
//   const { arView } = route.params;
//   const [hasPermission, setHasPermission] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.text}>Requesting camera permission...</Text>
//       </View>
//     );
//   }

//   if (!hasPermission) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.text}>Camera permission denied</Text>
//       </View>
//     );
//   }

//   const htmlContent = `
//   <html>
//     <head>
//       <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
//       <script src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.min.js"></script>

//       <style>
//         body { margin: 0; overflow: hidden; }
//         .label {
//           position: fixed;
//           bottom: 10px;
//           left: 50%;
//           transform: translateX(-50%);
//           padding: 10px 20px;
//           background: rgba(0,0,0,0.6);
//           color: white;
//           border-radius: 10px;
//           font-family: Arial;
//         }
//       </style>
//     </head>

//     <body>
//       <div class="label">
//         ${arView?.name || "Africa Map"} — ${
//     arView?.description || "AR Geography Learning"
//   }
//       </div>

//       <a-scene
//         vr-mode-ui="enabled: false"
//         embedded
//         arjs="trackingMethod: best; sourceType: camera; debugUIEnabled: false;"
//       >

//         <a-marker preset="hiro">

//           <!-- Africa Image Plane -->
//           <a-plane
//             src="${"data:image/jpg;base64,REPLACE"}"
//             height="1.5"
//             width="1.5"
//             rotation="-90 0 0"
//           >
//           </a-plane>

//           <!-- Floating title -->
//           <a-text
//             value="${arView?.name || "Africa Map"}"
//             color="yellow"
//             width="2"
//             position="0 1 0"
//             align="center"
//           ></a-text>

//         </a-marker>

//         <a-entity camera></a-entity>
//       </a-scene>
//     </body>
//   </html>`;

//   return (
//     <View style={{ flex: 1, backgroundColor: "#000" }}>
//       <WebView
//         originWhitelist={["*"]}
//         javaScriptEnabled
//         domStorageEnabled
//         mediaPlaybackRequiresUserAction={false}
//         allowsInlineMediaPlayback
//         mixedContentMode="always"
//         source={{ html: htmlContent }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//   },
//   text: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });

import React, { useState } from "react";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroDirectionalLight,
  ViroAmbientLight,
  ViroNode,
  ViroBox,
  Viro3DObject,
  ViroMaterials,
  ViroAnimations,
} from "@reactvision/react-viro";
import { StyleSheet } from "react-native";

// Register materials for countries
ViroMaterials.createMaterials({
  morocco: {
    diffuseColor: "#FF6B6B",
  },
  algeria: {
    diffuseColor: "#4ECDC4",
  },
  tunisia: {
    diffuseColor: "#45B7D1",
  },
  libya: {
    diffuseColor: "#FFA07A",
  },
  mauritania: {
    diffuseColor: "#98D8C8",
  },
  selected: {
    diffuseColor: "#FFD700",
  },
});

// Register animations
ViroAnimations.registerAnimations({
  rotate: {
    properties: {
      rotateY: "+=90",
    },
    duration: 2000,
    easing: "Linear",
  },
  pulse: {
    properties: {
      scaleX: 1.2,
      scaleY: 1.2,
      scaleZ: 1.2,
    },
    duration: 500,
    easing: "Bounce",
  },
});

const ARScene = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  // Country data with positions and information
  const countries = {
    morocco: {
      name: "المغرب",
      nameEn: "Morocco",
      position: [-0.3, 0, -2],
      scale: [0.15, 0.02, 0.15],
      info: "العاصمة: الرباط\nالموارد: الفوسفات، الأسماك",
      resources: ["⚗️", "🐟"],
    },
    algeria: {
      name: "الجزائر",
      nameEn: "Algeria",
      position: [0, 0, -2],
      scale: [0.25, 0.02, 0.2],
      info: "العاصمة: الجزائر\nالموارد: النفط، الغاز",
      resources: ["🛢️", "🔥"],
    },
    tunisia: {
      name: "تونس",
      nameEn: "Tunisia",
      position: [0.25, 0, -1.9],
      scale: [0.08, 0.02, 0.08],
      info: "العاصمة: تونس\nالموارد: الفوسفات",
      resources: ["⚗️"],
    },
    libya: {
      name: "ليبيا",
      nameEn: "Libya",
      position: [0.35, 0, -2],
      scale: [0.2, 0.02, 0.18],
      info: "العاصمة: طرابلس\nالموارد: النفط، الغاز",
      resources: ["🛢️", "🔥"],
    },
    mauritania: {
      name: "موريتانيا",
      nameEn: "Mauritania",
      position: [-0.35, -0.1, -2],
      scale: [0.15, 0.02, 0.15],
      info: "العاصمة: نواكشوط\nالموارد: الأسماك",
      resources: ["🐟"],
    },
  };

  const handleCountryClick = (countryId) => {
    setSelectedCountry(countryId);
    setShowInfo(true);

    // Auto-hide info after 5 seconds
    setTimeout(() => {
      setShowInfo(false);
    }, 5000);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
    setSelectedCountry(null);
  };

  return (
    <ViroARScene>
      {/* Lighting */}
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.2]}
        intensity={500}
      />

      {/* Title */}
      <ViroText
        text="خريطة المغرب العربي"
        position={[0, 0.4, -2]}
        width={2}
        height={0.5}
        style={styles.titleText}
        transformBehaviors={["billboard"]}
      />

      <ViroText
        text="اضغط على أي دولة للمعلومات"
        position={[0, 0.35, -2]}
        width={2}
        height={0.3}
        style={styles.subtitleText}
        transformBehaviors={["billboard"]}
      />

      {/* Map Container - Base */}
      <ViroNode position={[0, 0, 0]}>
        {/* Render each country as a 3D box */}
        {Object.entries(countries).map(([id, country]) => {
          const isSelected = selectedCountry === id;

          return (
            <ViroNode key={id} position={country.position}>
              {/* Country 3D representation */}
              <ViroBox
                position={[0, 0, 0]}
                scale={country.scale}
                materials={[isSelected ? "selected" : id]}
                onClick={() => handleCountryClick(id)}
                animation={
                  isSelected
                    ? { name: "pulse", run: true, loop: true }
                    : undefined
                }
                shadowCastingBitMask={0}
              />

              {/* Country name label (always visible) */}
              <ViroText
                text={country.name}
                position={[0, 0.15, 0]}
                width={0.5}
                height={0.2}
                style={styles.countryLabel}
                transformBehaviors={["billboard"]}
              />

              {/* Resource icons above country */}
              {country.resources.map((resource, index) => (
                <ViroText
                  key={`${id}-resource-${index}`}
                  text={resource}
                  position={[index * 0.08 - 0.04, 0.25, 0]}
                  width={0.2}
                  height={0.2}
                  style={styles.resourceIcon}
                  transformBehaviors={["billboard"]}
                />
              ))}
            </ViroNode>
          );
        })}
      </ViroNode>

      {/* Information Panel */}
      {showInfo && selectedCountry && (
        <ViroNode position={[0, -0.3, -1.5]}>
          {/* Info background */}
          <ViroBox
            position={[0, 0, 0]}
            scale={[0.6, 0.3, 0.01]}
            materials={["selected"]}
            onClick={handleCloseInfo}
          />

          {/* Country name */}
          <ViroText
            text={countries[selectedCountry].name}
            position={[0, 0.12, 0.01]}
            width={0.5}
            height={0.1}
            style={styles.infoTitle}
            transformBehaviors={["billboard"]}
          />

          {/* Country info */}
          <ViroText
            text={countries[selectedCountry].info}
            position={[0, 0, 0.01]}
            width={0.5}
            height={0.15}
            style={styles.infoText}
            transformBehaviors={["billboard"]}
          />

          {/* Close instruction */}
          <ViroText
            text="اضغط للإغلاق"
            position={[0, -0.12, 0.01]}
            width={0.3}
            height={0.08}
            style={styles.closeText}
            transformBehaviors={["billboard"]}
          />
        </ViroNode>
      )}

      {/* Legend */}
      <ViroNode position={[0.5, -0.3, -1.5]}>
        <ViroText
          text="🛢️ نفط  🔥 غاز\n⚗️ فوسفات  🐟 أسماك"
          position={[0, 0, 0]}
          width={0.5}
          height={0.2}
          style={styles.legendText}
          transformBehaviors={["billboard"]}
        />
      </ViroNode>
    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontFamily: "Arial",
    fontSize: 35,
    color: "#FFFFFF",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitleText: {
    fontFamily: "Arial",
    fontSize: 18,
    color: "#CCCCCC",
    textAlignVertical: "center",
    textAlign: "center",
  },
  countryLabel: {
    fontFamily: "Arial",
    fontSize: 20,
    color: "#FFFFFF",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  resourceIcon: {
    fontFamily: "Arial",
    fontSize: 25,
    color: "#FFFFFF",
    textAlignVertical: "center",
    textAlign: "center",
  },
  infoTitle: {
    fontFamily: "Arial",
    fontSize: 28,
    color: "#000000",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  infoText: {
    fontFamily: "Arial",
    fontSize: 18,
    color: "#333333",
    textAlignVertical: "center",
    textAlign: "center",
  },
  closeText: {
    fontFamily: "Arial",
    fontSize: 14,
    color: "#666666",
    textAlignVertical: "center",
    textAlign: "center",
  },
  legendText: {
    fontFamily: "Arial",
    fontSize: 16,
    color: "#FFFFFF",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default function StudentARScreen({ route }) {
  const { arView } = route?.params || {};

  return (
    <ViroARSceneNavigator
      initialScene={{ scene: ARScene }}
      viroAppProps={{ arView }}
      autofocus={true}
      style={{ flex: 1 }}
    />
  );
}
