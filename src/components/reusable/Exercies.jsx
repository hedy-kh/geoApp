import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Easyone from "./exercies/Lesson1/Easy/Easyone";
import Meduimone from "./exercies/Lesson1/meduim/Meduimone";
import Hardone from "./exercies/Lesson1/hard/Hardone";
const Exercies = ({ details, onClose }) => {
  const { lessonId, unitId, level } = details;

  const displayid = () => {
    console.log("UNIT:", unitId);
    console.log("LESSON:", lessonId);
    console.log("LEVEL:", level);
  };

  return (
    <Modal
      visible
      transparent
      presentationStyle="overFullScreen"
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header with Close Button */}
          <View style={styles.header}>
            <Text style={styles.title}>Exercise Screen</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Lesson: {lessonId}</Text>
            <Text style={styles.infoText}>Level: {level}</Text>
          </View>

          {/* Exercise Content */}
          <View style={styles.contentContainer}>
            {lessonId === "lesson-1" && level === "EASY" ? <Easyone /> : null}
            {lessonId === 'lesson-1' && level == "MEDIUM" ? <Meduimone /> : null}
            {lessonId =='lesson-1' && level == "HARD"? <Hardone/>:null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  modalContainer: {
    width: "95%",
    maxWidth: 900,
    height: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#4CAF50",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "300",
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  infoText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
});

export default Exercies;
