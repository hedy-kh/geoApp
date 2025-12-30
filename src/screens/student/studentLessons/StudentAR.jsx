import { useNavigation } from "@react-navigation/native";
import { View,TouchableOpacity,Text,StyleSheet} from "react-native";

const StudentAR = ({ arViewId = 1 }) => {
  const navigation = useNavigation();
  const currentAR = AR_VIEWS.find((v) => v.id === arViewId);

  const openAR = () => {
    if (!currentAR) return;
    navigation.navigate("StudentARScreen", { arView: currentAR });
  };

  return (
    <View style={styles.toolsSection}>
      <TouchableOpacity style={styles.toolButton}>
        <Text style={styles.toolIcon}>🕶️</Text>
        <Text style={styles.toolText}>جولة 360°</Text>
          </TouchableOpacity>
          

      <TouchableOpacity
        style={[styles.toolButton, styles.toolButtonAR]}
        onPress={openAR}
      >
        <Text style={styles.toolIcon}>📸</Text>
        <Text style={styles.toolText}>
          تجربة AR {currentAR ? `(${currentAR.name})` : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolsSection: { flexDirection: "row", marginBottom: 40 },

  toolButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: "#7C3AED",
    alignItems: "center",
  },
  toolButtonAR: { backgroundColor: "#059669" },
  toolIcon: { fontSize: 24 },
  toolText: { color: "#FFF", fontWeight: "600" },
});
export default StudentAR;
