import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const GAMES_DATA = [
    { 
      id: '1', 
      title: 'لعبة الذاكرة الجغرافية', 
      description: 'تدريب الذاكرة على تذكر العواصم والمعالم', 
      icon: '🧠', 
      type: 'memory',
      screen: 'MemoryGame'
    },
    { 
      id: '2', 
      title: 'تركيب الخريطة', 
      description: 'أعيد بناء خريطة المغرب العربي بقطع الألغاز', 
      icon: '🧩', 
      type: 'puzzle',
      screen: 'PuzzleGame'
    },
    { 
      id: '3', 
      title: 'المستكشف الجغرافي', 
      description: 'مغامرة افتراضية عبر تضاريس الوطن العربي', 
      icon: '🗺️', 
      type: 'geo_adventure',
      screen: 'AdventureGame'
    },
];

const StudentGamesScreen = ({ navigation }) => (
    <SafeAreaView style={styles.container}>
        <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.gamesHeader}>
                <Text style={styles.gamesTitle}>الألعاب التعليمية 🎮</Text>
                <Text style={styles.gamesSubtitle}>تعلم باللعب والمرح</Text>
            </View>

            {GAMES_DATA.map(game => (
                <TouchableOpacity
                    key={game.id}
                    style={styles.gameCard}
                    onPress={() => navigation.navigate(game.screen)}
                    activeOpacity={0.7}
                >
                    <View style={styles.gameCardContent}>
                        <Text style={styles.gameIcon}>{game.icon}</Text>
                        <View style={styles.gameInfo}>
                            <Text style={styles.gameTitle}>{game.title}</Text>
                            <Text style={styles.gameDescription} numberOfLines={2}>
                                {game.description}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.playButton}>
                        <Text style={styles.playButtonText}>العب الآن</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40, // Added bottom padding
        minHeight: '100%', // Ensures content fills screen
    },
    gamesHeader: {
        marginBottom: 24,
        paddingTop: 10,
    },
    gamesTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'right',
    },
    gamesSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'right',
    },
    gameCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    gameCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    gameIcon: {
        fontSize: 48,
        marginRight: 16,
    },
    gameInfo: {
        flex: 1,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 6,
        textAlign: 'right',
    },
    gameDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 22,
        textAlign: 'right',
    },
    playButton: {
        backgroundColor: '#7C3AED',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    playButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});

export default StudentGamesScreen;