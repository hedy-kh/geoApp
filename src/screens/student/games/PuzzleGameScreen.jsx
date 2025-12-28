import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PuzzleGameScreen = ({ navigation }) => {
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartPuzzle = () => {
    Alert.alert('بدأ التركيب', 'حاول تجميع خريطة المغرب العربي بالترتيب الصحيح!');
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPuzzleCompleted(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-right" size={24} color="#374151" />
          <Text style={styles.backText}>رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تركيب الخريطة</Text>
        <View style={styles.progressContainer}>
          <Icon name="puzzle" size={20} color="#8B5CF6" />
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.startScreen}>
          <View style={styles.gameIconContainer}>
            <Text style={styles.gameIcon}>🧩</Text>
          </View>
          <Text style={styles.gameTitle}>لعبة تركيب الخريطة</Text>
          <Text style={styles.gameDescription}>
            أعِد بناء خريطة المغرب العربي! اسحب القطع إلى أماكنها الصحيحة
            لبناء الخريطة الكاملة.
          </Text>
          
          {puzzleCompleted ? (
            <View style={styles.completionContainer}>
              <View style={styles.completionBadge}>
                <Icon name="trophy-award" size={60} color="#F59E0B" />
              </View>
              <Text style={styles.congratsText}>مبروك! 🎉</Text>
              <Text style={styles.completionMessage}>
                لقد أتممت تركيب خريطة المغرب العربي بنجاح!
              </Text>
              <Text style={styles.pointsEarned}>+50 نقطة</Text>
              
              <TouchableOpacity 
                style={styles.playAgainButton}
                onPress={() => {
                  setPuzzleCompleted(false);
                  setProgress(0);
                }}
              >
                <Text style={styles.playAgainText}>العب مرة أخرى</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.puzzleContainer}>
                <View style={styles.puzzleArea}>
                  <Text style={styles.puzzleHint}>اسحب القطع هنا</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressLabel}>
                    {progress === 0 ? 'ابدأ اللعبة' : `جاري التجميع: ${progress}%`}
                  </Text>
                </View>
                
                <View style={styles.puzzlePieces}>
                  <Text style={styles.piecesTitle}>قطع الألغاز:</Text>
                  <View style={styles.piecesContainer}>
                    {['🇲🇦', '🇩🇿', '🇹🇳', '🇱🇾', '🇲🇷'].map((piece, index) => (
                      <TouchableOpacity 
                        key={index}
                        style={styles.piece}
                        onPress={() => Alert.alert('قطعة', `قطعة ${piece}`)}
                      >
                        <Text style={styles.pieceText}>{piece}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.startButton}
                onPress={handleStartPuzzle}
                disabled={progress > 0}
              >
                <Text style={styles.startButtonText}>
                  {progress === 0 ? 'بدء التركيب' : 'جاري التركيب...'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B21B6',
    marginLeft: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexGrow: 1,
  },
  startScreen: {
    alignItems: 'center',
  },
  gameIconContainer: {
    backgroundColor: '#FFFFFF',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gameIcon: {
    fontSize: 60,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5B21B6',
    marginBottom: 12,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    backgroundColor: '#F5F3FF',
    padding: 16,
    borderRadius: 12,
  },
  puzzleContainer: {
    width: '100%',
    marginBottom: 32,
  },
  puzzleArea: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#DDD6FE',
    borderStyle: 'dashed',
    minHeight: 200,
    justifyContent: 'center',
  },
  puzzleHint: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  puzzlePieces: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  piecesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'right',
  },
  piecesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  piece: {
    width: 70,
    height: 70,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD6FE',
  },
  pieceText: {
    fontSize: 32,
  },
  startButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    marginTop: 20,
    opacity: 1,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completionContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FDE68A',
    width: '100%',
  },
  completionBadge: {
    marginBottom: 24,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 16,
  },
  completionMessage: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 28,
  },
  pointsEarned: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 32,
  },
  playAgainButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  playAgainText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default PuzzleGameScreen;