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

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Gyroscope } from "expo-sensors";
import Svg, {
  Path,
  G,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
  Circle,
} from "react-native-svg";
const { width, height } = Dimensions.get("window");
export default function StudentARScreen({ route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;

  const countries = {
    MOROCCO: {
      name: "المغرب",
      capital: "الرباط",
      population: "37 مليون",
      resources: "⚗️ 🐟 ☀️",
      color: "#FF6B6B",
    },
    ALGERIA: {
      name: "الجزائر",
      capital: "الجزائر",
      population: "44 مليون",
      resources: "🛢️ 🔥 ☀️",
      color: "#4ECDC4",
    },
    TUNISIA: {
      name: "تونس",
      capital: "تونس",
      population: "12 مليون",
      resources: "⚗️",
      color: "#45B7D1",
    },
    LIBYA: {
      name: "ليبيا",
      capital: "طرابلس",
      population: "7 مليون",
      resources: "🛢️ 🔥",
      color: "#FFA07A",
    },
    MAURITANIA: {
      name: "موريتانيا",
      capital: "نواكشوط",
      population: "5 مليون",
      resources: "🐟",
      color: "#98D8C8",
    },
  };

  useEffect(() => {
    // Subscribe to gyroscope
    const subscription = Gyroscope.addListener((data) => {
      // Smooth movement based on gyroscope
      const moveX = data.y * 300;
      const moveY = -data.x * 300;
      const scaleValue = 1 + data.z * 0.1;
      const rotationValue = data.y * 50;

      Animated.parallel([
        Animated.spring(animatedX, {
          toValue: moveX,
          friction: 10,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(animatedY, {
          toValue: moveY,
          friction: 10,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(animatedScale, {
          toValue: Math.max(0.5, Math.min(1.8, scaleValue)),
          friction: 10,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(animatedRotation, {
          toValue: rotationValue,
          friction: 10,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    });

    Gyroscope.setUpdateInterval(16); // 60fps

    return () => subscription.remove();
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>نحتاج إذن الكاميرا للواقع المعزز</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>منح الإذن</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCountryPress = (country) => {
    setSelectedCountry(country);
  };

  const getCountryColor = (country) => {
    return selectedCountry === country ? "#FFD700" : countries[country].color;
  };

  const rotateValue = animatedRotation.interpolate({
    inputRange: [-100, 100],
    outputRange: ["-15deg", "15deg"],
  });

  return (
    <View style={styles.container}>
      {/* Camera Background */}
      <CameraView style={StyleSheet.absoluteFillObject} facing="back" />

      {/* AR Content Overlay */}
      <View style={styles.arContainer}>
        {/* Animated 3D-like Map */}
        <Animated.View
          style={[
            styles.mapWrapper,
            {
              transform: [
                { translateX: animatedX },
                { translateY: animatedY },
                { scale: animatedScale },
                { perspective: 1000 },
                { rotateY: rotateValue },
              ],
            },
          ]}
        >
          {/* Shadow layer for depth */}
          <View style={styles.shadowLayer} />

          {/* Main Map */}
          <View style={styles.mapContainer}>
            <Svg width={350} height={350} viewBox="820 180 450 350">
              <Defs>
                <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                  <Stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                </RadialGradient>
              </Defs>

              <G>
                {/* Glow effect */}
                <Circle cx="1050" cy="350" r="200" fill="url(#glow)" />

                {/* TUNISIA */}
                <Path
                  d="M1048.2 289.1l-0.1 4.9-2.6 1.8-1.6 2.1-3.6 2.5 0.6 2.6-0.4 2.8-2.6 1.4-2.6-11.5-3.4-2.6-0.1-1.5-4.5-3.9-0.6-4.8 3.2-3.6 1.1-5.3-1-6.1 1-3.3 5.7-2.5 3.7 0.7 0 3.3 4.4-2.4 0.4 1.2-2.5 3.2 0.1 2.9 1.9 1.6-0.5 5.6-3.5 3.2 1.2 3.5 2.8 0.1 1.4 3.1 2.1 1z"
                  fill={getCountryColor("TUNISIA")}
                  stroke="#fff"
                  strokeWidth="3"
                  opacity={0.9}
                  onPress={() => handleCountryPress("TUNISIA")}
                />

                {/* LIBYA */}
                <Path
                  d="M1122.6 299.1l-1.7 3.1 1 2.8-1.1 3.9 2 5.2 1.3 22.8 1 23.7 0.5 12.8-6.4 0 0 2.7-22.6-12.3-22.5-12.3-5.5 3.5-3.8 2.4-3.2-3.5-8.8-2.8-2.5-4-4.5-3-2.5 1.2-2.1-3.6-0.2-2.7-3.4-4.7 2.2-2.7-0.6-4 0.6-3.5-0.4-3 0.8-5.2-0.4-3-1.9-5.7 2.6-1.4 0.4-2.8-0.6-2.6 3.6-2.5 1.6-2.1 2.6-1.8 0.1-4.9 6.4 2.2 2.3-0.6 4.5 1.1 7.3 2.9 2.8 5.7 4.9 1.2 7.8 2.7 6 3.2 2.5-1.7 2.5-2.9-1.6-4.9 1.5-3.2 3.7-3 3.7-0.8 7.4 1.3 2 2.8 2 0.1 1.8 1.1 5.4 0.7 1.5 2.1z"
                  fill={getCountryColor("LIBYA")}
                  stroke="#fff"
                  strokeWidth="3"
                  opacity={0.9}
                  onPress={() => handleCountryPress("LIBYA")}
                />

                {/* ALGERIA */}
                <Path
                  d="M1031 264.6l-1 3.3 1 6.1-1.1 5.3-3.2 3.6 0.6 4.8 4.5 3.9 0.1 1.5 3.4 2.6 2.6 11.5 1.9 5.7 0.4 3-0.8 5.2 0.4 3-0.6 3.5 0.6 4-2.2 2.7 3.4 4.7 0.2 2.7 2.1 3.6 2.5-1.2 4.5 3 2.5 4-18.8 12.3-16 12.6-7.8 2.8-6.2 0.7-0.1-4.1-2.6-1.1-3.5-1.8-1.3-3-18.7-14-18.6-14-20.5-15.6 0.1-1.2 0.1-0.4 0.1-7.6 8.9-4.8 5.4-1 4.5-1.7 2.1-3.2 6.4-2.5 0.3-4.8 3.1-0.6 2.5-2.3 7.1-1.1 1-2.5-1.4-1.4-1.9-6.8-0.3-3.9-1.9-4.1 5.1-3.5 5.8-1.1 3.3-2.6 5.1-2 9-1.1 8.8-0.5 2.7 0.9 4.9-2.5 5.7-0.1 2.2 1.5 3.6-0.4z"
                  fill={getCountryColor("ALGERIA")}
                  stroke="#fff"
                  strokeWidth="3"
                  opacity={0.9}
                  onPress={() => handleCountryPress("ALGERIA")}
                />

                {/* MOROCCO */}
                <Path
                  d="M974.8 276l1.9 4.1 0.3 3.9 1.9 6.8 1.4 1.4-1 2.5-7.1 1.1-2.5 2.3-3.1 0.6-0.3 4.8-6.4 2.5-2.1 3.2-4.5 1.7-5.4 1-8.9 4.8-0.1 7.6-0.9 0 0.1 3.4-3.4 0.2-1.8 1.5-2.5 0-2-0.9-4.6 0.7-1.9 5-1.8 0.5-2.7 8.1-7.9 6.9-2 8.9-2.4 2.9-0.7 2.3-12.5 0.5-0.1 0 0.3-3 2.2-1.7 1.9-3.4-0.3-2.2 2-4.5 3.2-4.1 1.9-1 1.6-3.7 0.2-3.5 2.1-3.9 3.8-2.4 3.6-6.5 0.1-0.1 2.9-2.5 5.1-0.7 4.4-4.4 2.8-1.7 4.7-5.4-1.2-7.9 2.2-5.6 0.9-3.4 3.6-4.3 5.4-2.9 4.1-2.7 3.7-6.6 1.8-4 3.9 0.1 3.1 2.7 5.1-0.4 5.5 1.4 2.4 0z"
                  fill={getCountryColor("MOROCCO")}
                  stroke="#fff"
                  strokeWidth="3"
                  opacity={0.9}
                  onPress={() => handleCountryPress("MOROCCO")}
                />

                {/* MAURITANIA */}
                <Path
                  d="M959.2 341.5l-8.5 0.1 2.4 27.7 2.5 27.7 1 0.8-1.3 4.5-22.5 0.1-0.9 1.4-2.1-0.4-3.2 1.3-3.9-1.8-1.8 0.1-1 3.8-1.9 1.2-3.6-4.4-3.4-4.8-3.6-1.7-2.7-1.8-3.1 0-2.8 1.4-2.7-0.5-2 2-0.4-3.4 1.6-3.2 0.8-6-0.4-6.4-0.6-3.2 0.6-3.2-1.4-3-2.8-2.8 1.3-2.1 21.7 0-0.9-9.3 1.5-3.3 5.2-0.5 0.2-16.5 18 0.4 0.2-9.8 20.5 15.6z"
                  fill={getCountryColor("MAURITANIA")}
                  stroke="#fff"
                  strokeWidth="3"
                  opacity={0.9}
                  onPress={() => handleCountryPress("MAURITANIA")}
                />

                {/* Country Labels */}
                <SvgText
                  x="950"
                  y="295"
                  fontSize="22"
                  fill="#fff"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  المغرب
                </SvgText>
                <SvgText x="950" y="318" fontSize="20" textAnchor="middle">
                  ⚗️ 🐟 ☀️
                </SvgText>

                <SvgText
                  x="1000"
                  y="320"
                  fontSize="22"
                  fill="#fff"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  الجزائر
                </SvgText>
                <SvgText x="1000" y="343" fontSize="20" textAnchor="middle">
                  🛢️ 🔥 ☀️
                </SvgText>

                <SvgText
                  x="1040"
                  y="290"
                  fontSize="22"
                  fill="#fff"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  تونس
                </SvgText>
                <SvgText x="1040" y="313" fontSize="20" textAnchor="middle">
                  ⚗️
                </SvgText>

                <SvgText
                  x="1090"
                  y="330"
                  fontSize="22"
                  fill="#fff"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ليبيا
                </SvgText>
                <SvgText x="1090" y="353" fontSize="20" textAnchor="middle">
                  🛢️ 🔥
                </SvgText>

                <SvgText
                  x="930"
                  y="385"
                  fontSize="20"
                  fill="#fff"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  موريتانيا
                </SvgText>
                <SvgText x="930" y="405" fontSize="20" textAnchor="middle">
                  🐟
                </SvgText>
              </G>
            </Svg>
          </View>
        </Animated.View>

        {/* UI Overlay */}
        <View style={styles.uiOverlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🗺️ واقع معزز - المغرب العربي</Text>
            <Text style={styles.headerSubtitle}>
              حرّك هاتفك لرؤية الخريطة من زوايا مختلفة
            </Text>
          </View>

          {/* Info Panel */}
          {selectedCountry && (
            <View style={styles.infoPanel}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedCountry(null)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.countryName}>
                {countries[selectedCountry].name}
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>العاصمة:</Text>
                <Text style={styles.infoValue}>
                  {countries[selectedCountry].capital}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>السكان:</Text>
                <Text style={styles.infoValue}>
                  {countries[selectedCountry].population}
                </Text>
              </View>
              <View style={styles.resourceRow}>
                <Text style={styles.resourceIcons}>
                  {countries[selectedCountry].resources}
                </Text>
              </View>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              📱 حرك هاتفك لتحريك الخريطة
            </Text>
            <Text style={styles.instructionText}>
              👆 المس أي دولة لرؤية المعلومات
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  arContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapWrapper: {
    width: 350,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  shadowLayer: {
    position: "absolute",
    width: 320,
    height: 320,
    backgroundColor: "#000",
    opacity: 0.4,
    borderRadius: 20,
    transform: [{ translateY: 15 }, { scale: 0.95 }],
  },
  mapContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: "rgba(255,215,0,0.3)",
  },
  uiOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "box-none",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#FFFFFF",
    marginTop: 5,
    textAlign: "center",
  },
  infoPanel: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF6B6B",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  countryName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginRight: 10,
    minWidth: 70,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  resourceRow: {
    alignItems: "center",
    marginTop: 10,
  },
  resourceIcons: {
    fontSize: 28,
  },
  instructions: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 15,
    padding: 15,
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
});












// import  { useState, useRef, useEffect, Suspense } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import { Canvas, useFrame } from "@react-three/fiber/native";
// import { Gyroscope } from "expo-sensors";
// import * as THREE from "three";
// import NorthAfricaMap3D from "../../../components/reusable/AfricaMap3D";
// const { width, height } = Dimensions.get("window");

// const COUNTRIES = [
//   { id: "tunisia", name: "تونس", color: "#e74c3c", pos: [0, 0, 0] },
//   { id: "algeria", name: "الجزائر", color: "#3498db", pos: [-2, 0, -1] },
//   { id: "morocco", name: "المغرب", color: "#2ecc71", pos: [-4, 0, -2] },
//   { id: "libya", name: "ليبيا", color: "#f39c12", pos: [2, 0, -1] },
// ];

// function ARAnchor({ children }) {
//   const group = useRef();
//   const gyro = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     Gyroscope.setUpdateInterval(16);
//     const sub = Gyroscope.addListener(({ x, y }) => {
//       gyro.current.x = x;
//       gyro.current.y = y;
//     });
//     return () => sub.remove();
//   }, []);

//   useFrame(() => {
//     if (!group.current) return;

//     group.current.rotation.y += gyro.current.y * 0.02;
//     group.current.rotation.x += gyro.current.x * 0.02;
//   });

//   return (
//     <group ref={group} position={[0, -0.5, -3]}>
//       {children}
//     </group>
//   );
// }

// function Country({ data, selected, onSelect }) {
//   const ref = useRef();

//   useFrame(({ clock }) => {
//     ref.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.1;
//     ref.current.scale.lerp(
//       new THREE.Vector3(
//         selected ? 1.3 : 1,
//         selected ? 1.3 : 1,
//         selected ? 1.3 : 1
//       ),
//       0.1
//     );
//   });

//   return (
//     <mesh ref={ref} position={data.pos} onPointerDown={() => onSelect(data)}>
//       <boxGeometry args={[1, 0.3, 1]} />
//       <meshStandardMaterial
//         color={data.color}
//         emissive={data.color}
//         emissiveIntensity={selected ? 0.8 : 0.3}
//         metalness={0.6}
//         roughness={0.3}
//       />
//     </mesh>
//   );
// }

// function ARScene({ selectedCountry, onSelect }) {
//   return (
//     <>
//       <ambientLight intensity={0.4} />
//       <directionalLight position={[5, 5, 5]} intensity={1.2} />

//       <ARAnchor>
//         {COUNTRIES.map((c) => (
//           <Country
//             key={c.id}
//             data={c}
//             selected={selectedCountry?.id === c.id}
//             onSelect={onSelect}
//           />
//         ))}
//       </ARAnchor>
//     </>
//   );
// }

// export default function StudentARScreen({ route }) {
//   const { arView } = route.params;
//   const [permission, requestPermission] = useCameraPermissions();
//   const [selectedCountry, setSelectedCountry] = useState(null);

//   if (!permission?.granted) {
//     return (
//       <View style={styles.permission}>
//         <Text style={styles.text}>نحتاج إذن الكاميرا</Text>
//         <TouchableOpacity onPress={requestPermission}>
//           <Text style={styles.btn}>✓ منح الإذن</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView style={StyleSheet.absoluteFill} facing="back" />

//       <Canvas camera={{ position: [0, 1, 2], fov: 70 }} gl={{ alpha: true }}>
//         <Suspense fallback={null}>
//           <ARScene
//             selectedCountry={selectedCountry}
//             onSelect={setSelectedCountry}
//           />
//         </Suspense>
//       </Canvas>

//       <View style={styles.header}>
//         <Text style={styles.title}>🌍 {arView?.name || "شمال أفريقيا"}</Text>
//         <Text style={styles.subtitle}>حرّك الهاتف لتشعر بالعمق</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   header: {
//     position: "absolute",
//     top: 40,
//     alignSelf: "center",
//     backgroundColor: "rgba(0,0,0,0.8)",
//     padding: 14,
//     borderRadius: 16,
//   },
//   title: { color: "#4fc3f7", fontSize: 20, fontWeight: "bold" },
//   subtitle: { color: "#ccc", fontSize: 12, textAlign: "center" },
//   permission: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//   },
//   text: { color: "#fff", fontSize: 18, marginBottom: 20 },
//   btn: { color: "#2ecc71", fontSize: 20 },
// });
