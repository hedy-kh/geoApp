import React from "react";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroDirectionalLight,
  ViroImage,
} from "@reactvision/react-viro";

const ARScene = (props) => {
  const { arView } = props.sceneNavigator.viroAppProps;

  return (
    <ViroARScene>
      <ViroDirectionalLight color="#ffffff" direction={[0, -1, 0]} />

      <ViroText
        text={arView?.name || "No name"}
        position={[0, 0, -1]}
        style={{ fontSize: 30, color: "white" }}
      />

      {arView?.type === "3d_model" && (
        <ViroImage
          source={require("../../../../assets/images/africamap.jpg")}
          position={[0, -0.5, -1]}
          scale={[0.5, 0.5, 0.5]}
        />
      )}
    </ViroARScene>
  );
};

export default function StudentARScreen({ route }) {
  const { arView } = route.params;

  return (
    <ViroARSceneNavigator
      initialScene={{ scene: ARScene }}
      viroAppProps={{ arView }}
      autofocus
    />
  );
}
