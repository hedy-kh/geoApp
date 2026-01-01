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

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { WebView } from "react-native-webview";

const arImage = require("../../../../assets/images/africamap.jpg");

export default function StudentARScreen({ route }) {
  const { arView } = route.params;
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera permission denied</Text>
      </View>
    );
  }

  const htmlContent = `
  <html>
    <head>
      <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
      <script src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.min.js"></script>

      <style>
        body { margin: 0; overflow: hidden; }
        .label {
          position: fixed;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
          background: rgba(0,0,0,0.6);
          color: white;
          border-radius: 10px;
          font-family: Arial;
        }
      </style>
    </head>

    <body>
      <div class="label">
        ${arView?.name || "Africa Map"} — ${
    arView?.description || "AR Geography Learning"
  }
      </div>

      <a-scene
        vr-mode-ui="enabled: false"
        embedded
        arjs="trackingMethod: best; sourceType: camera; debugUIEnabled: false;"
      >

        <a-marker preset="hiro">

          <!-- Africa Image Plane -->
          <a-plane
            src="${"data:image/jpg;base64,REPLACE"}"
            height="1.5"
            width="1.5"
            rotation="-90 0 0"
          >
          </a-plane>

          <!-- Floating title -->
          <a-text
            value="${arView?.name || "Africa Map"}"
            color="yellow"
            width="2"
            position="0 1 0"
            align="center"
          ></a-text>

        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>
    </body>
  </html>`;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <WebView
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        mixedContentMode="always"
        source={{ html: htmlContent }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
