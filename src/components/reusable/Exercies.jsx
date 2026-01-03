import { View, Text, TouchableOpacity, Modal, Button } from "react-native";
import React from "react";

const Exercies = ({ details, onClose }) => {
  const { lessonId, unitId, level } = details;

  const displayid = () => {
    console.log("UNIT:", unitId);
    console.log("LESSON:", lessonId);
    console.log("LEVEL:", level);
  };

  return (
    <Modal visible transparent animationType="slide">

      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Exercies Screen
          </Text>

          <Text>Lesson: {lessonId}</Text>
          <Text>Level: {level}</Text>

          {/* <Button title="show id" onPress={displayid} /> */}

          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    
    </Modal>
  );
};

export default Exercies;
