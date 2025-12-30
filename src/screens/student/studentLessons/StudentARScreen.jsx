// import React, { useState, useRef } from "react";
// import {
//   ViroARSceneNavigator,
//   ViroARScene,
//   ViroText,
//   Viro3DObject,
//   ViroDirectionalLight,
//   ViroImage,
// } from "@reactvision/react-viro";

// export default function StudentARScreen({ route }) {
//   const { arView } = route.params;

//   const ARScene = () => {
//     return (
//       <ViroARScene>
//         <ViroDirectionalLight color="#ffffff" direction={[0, -1, 0]} />

//         {/* Example Text */}
//         <ViroText
//           text={arView.name}
//           position={[0, 0, -1]}
//           style={{ fontSize: 30, color: "white" }}
//         />

//         {/* Example 3D Model when type === 3d_model */}
//         {arView.type === "3d_model" && (
//           <ViroImage
//             source={require("../../../../assets/images/africamap.jpg")}
//             position={[0, -0.5, -1]}
//             scale={[0.5, 0.5, 0.5]}
//           />
//         )}
//       </ViroARScene>
//     );
//   };

//   return <ViroARSceneNavigator initialScene={{ scene: ARScene }} autofocus />;
// }

import { View, Text } from 'react-native'
import React from 'react'

const StudentARScreen = () => {
  return (
    <View>
      <Text>StudentARScreen</Text>
    </View>
  )
}

export default StudentARScreen