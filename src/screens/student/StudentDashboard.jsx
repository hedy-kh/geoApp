// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   Platform,
//   Modal,
//   TextInput,
//   ActivityIndicator
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const { width, height } = Dimensions.get('window');
// const isSmallScreen = width < 375;

// const StudentDashboard = ({ navigation }) => {
//   const [activeTab, setActiveTab] = useState('home');
//   const [selectedUnit, setSelectedUnit] = useState(null);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [completedLessons, setCompletedLessons] = useState([]);
//   const [isAiOpen, setIsAiOpen] = useState(false);
//   const [aiQuery, setAiQuery] = useState('');
//   const [aiResponse, setAiResponse] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);

//   const CURRICULUM = [
//     {
//       id: 'unit-1',
//       title: 'المغرب العربي: الموقع والمساحة',
//       lessons: [
//         {
//           id: 'lesson-1',
//           title: 'تعريف المغرب العربي',
//           description: 'التعريف بالمغرب العربي وموقعها الجغرافي',
//           videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//           content: '• المغرب العربي منطقة في شمال أفريقيا\n• تضم خمس دول: المغرب، الجزائر، تونس، ليبيا، موريتانيا\n• تطل على البحر الأبيض المتوسط والمحيط الأطلسي',
//           funFact: 'المغرب العربي يضم أكبر صحراء حارة في العالم!'
//         },
//         {
//           id: 'lesson-2',
//           title: 'حدود المغرب العربي',
//           description: 'الحدود البرية والبحرية لدول المغرب العربي',
//           videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//           content: '• حدود برية مع أوروبا عبر مضيق جبل طارق\n• حدود بحرية طويلة على المتوسط والأطلسي\n• حدود جنوبية مع دول إفريقيا جنوب الصحراء',
//           funFact: 'مضيق جبل طارق يفصل بين قارتين!'
//         }
//       ]
//     }
//   ];
//   const GAMES_DATA = [
//     { id: '1', title: 'لعبة الذاكرة الجغرافية', description: 'تدريب الذاكرة على تذكر العواصم والمعالم', icon: '🧠', type: 'memory' },
//     { id: '2', title: 'تركيب الخريطة', description: 'أعيد بناء خريطة المغرب العربي بقطع الألغاز', icon: '🧩', type: 'puzzle' },
//     { id: '3', title: 'المستكشف الجغرافي', description: 'مغامرة افتراضية عبر تضاريس الوطن العربي', icon: '🗺️', type: 'geo_adventure' },
//   ];

//   const handleAiAsk = async () => {
//     if (!aiQuery.trim()) return;
//     setAiLoading(true);
//     setTimeout(() => {
//       setAiResponse(`هذا رد ذكي من المساعد الجغرافي عن: "${aiQuery}"\n\nالمغرب العربي منطقة غنية بالتنوع الجغرافي والثقافي. الدول الخمس لكل منها عاصمة مميزة وتاريخ عريق.`);
//       setAiLoading(false);
//     }, 2000);
//   };

//   const onQuizComplete = (score) => {
//     if (score >= 50 && selectedLesson) {
//       if (!completedLessons.includes(selectedLesson.id)) {
//         setCompletedLessons([...completedLessons, selectedLesson.id]);
//       }
//     }
//     alert(`نهائك: ${score}/100 ${score >= 50 ? 'مبروك! أكملت الدرس 🎉' : 'حاول مرة أخرى 💪'}`);
//   };

//   // Home Tab
//   const renderHomeTab = () => (
//     <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
//       {/* Hero Section */}
//       <View style={styles.heroSection}>
//         <Text style={styles.heroTitle}>
//           استكشف عالمك {'\n'}
//           <Text style={styles.heroHighlight}>بذكاء!</Text>
//         </Text>
//         <Text style={styles.heroSubtitle}>
//           حوّل درس الجغرافيا إلى مغامرة رقمية
//         </Text>
//         <TouchableOpacity
//           style={styles.startJourneyButton}
//           onPress={() => setActiveTab('learn')}
//         >
//           <Text style={styles.startJourneyText}>ابدأ الرحلة 🚀</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Daily Tasks */}
//       <View style={styles.tasksSection}>
//         <View style={styles.taskCard}>
//           <Text style={styles.taskIcon}>🧭</Text>
//           <View style={styles.taskContent}>
//             <Text style={styles.taskTitle}>مهمة اليوم</Text>
//             <Text style={styles.taskDescription}>
//               اكتشف الفرق بين المناخ المتوسطي والصحراوي
//             </Text>
//           </View>
//         </View>

//         <View style={[styles.taskCard, styles.achievementCard]}>
//           <Text style={styles.taskIcon}>🏆</Text>
//           <View style={styles.taskContent}>
//             <Text style={[styles.taskTitle, styles.achievementTitle]}>أعلى نتيجة</Text>
//             <Text style={[styles.taskDescription, styles.achievementDescription]}>
//               أحمد حصل على 500 نقطة في تحدي السياحة
//             </Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );

//   // Learn Tab - Unit Selection
//   const renderUnits = () => (
//     <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
//       <View style={styles.unitsHeader}>
//         <Text style={styles.unitsTitle}>اختر المحور الدراسي 📚</Text>
//         <Text style={styles.unitsSubtitle}>حدد مسار رحلتك التعليمية</Text>
//       </View>

//       <View style={styles.unitsGrid}>
//         {CURRICULUM.map(unit => (
//           <TouchableOpacity
//             key={unit.id}
//             style={styles.unitCard}
//             onPress={() => setSelectedUnit(unit)}
//           >
//             <View style={styles.unitIconContainer}>
//               <Text style={styles.unitIcon}>🌍</Text>
//             </View>
//             <Text style={styles.unitTitle}>{unit.title}</Text>
//             <Text style={styles.unitDescription}>
//               {unit.lessons.length} دروس تفاعلية
//             </Text>
//             <View style={styles.unitArrow}>
//               <Text style={styles.unitArrowText}>دخول المحور </Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </ScrollView>
//   );

//   // Lessons List
//   const renderLessonsList = () => (
//     <View style={styles.fullScreenContainer}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => setSelectedUnit(null)}
//       >
//         <Icon name="arrow-right" size={24} color="#4F46E5" />
//         <Text style={styles.backButtonText}>رجوع</Text>
//       </TouchableOpacity>

//       <View style={styles.lessonsHeader}>
//         <Text style={styles.lessonsHeaderTitle}>دروس المحور</Text>
//         <Text style={styles.lessonsHeaderSubtitle}>{selectedUnit.title}</Text>
//       </View>

//       <ScrollView style={styles.lessonsListContainer}>
//         {selectedUnit.lessons.map((lesson, index) => (
//           <TouchableOpacity
//             key={lesson.id}
//             style={[
//               styles.lessonCard,
//               selectedLesson?.id === lesson.id && styles.lessonCardActive
//             ]}
//             onPress={() => setSelectedLesson(lesson)}
//           >
//             <View style={styles.lessonCardHeader}>
//               <View style={styles.lessonNumber}>
//                 <Text style={styles.lessonNumberText}>{index + 1}</Text>
//               </View>
//               <View style={styles.lessonCardInfo}>
//                 <Text style={styles.lessonCardTitle}>{lesson.title}</Text>
//                 <Text style={styles.lessonCardDescription} numberOfLines={2}>
//                   {lesson.description}
//                 </Text>
//               </View>
//               {completedLessons.includes(lesson.id) && (
//                 <Icon name="check-circle" size={24} color="#10B981" />
//               )}
//             </View>
//             <TouchableOpacity
//               style={styles.startLessonButton}
//               onPress={() => setSelectedLesson(lesson)}
//             >
//               <Text style={styles.startLessonText}>بدء الدرس </Text>
//             </TouchableOpacity>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );

//   const renderLessonDetail = () => (
//     <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
//       <View style={styles.lessonDetailHeader}>
//         <TouchableOpacity
//           style={styles.backButtonSmall}
//           onPress={() => setSelectedLesson(null)}
//         >
//           <Icon name="arrow-right" size={20} color="#4F46E5" />
//           <Text style={styles.backButtonTextSmall}>رجوع</Text>
//         </TouchableOpacity>
//         <Text style={styles.lessonDetailTitle} numberOfLines={2}>
//           {selectedLesson.title}
//         </Text>
//       </View>

//       {/* Video Section */}
//       <View style={styles.videoContainer}>
//         <View style={styles.videoPlaceholder}>
//           <Icon name="play-circle" size={50} color="#FFFFFF" />
//           <Text style={styles.videoPlaceholderText}>فيديو الدرس</Text>
//         </View>
//       </View>

//       {/* Content */}
//       <View style={styles.contentSection}>
//         <Text style={styles.sectionTitle}>📖 المحتوى التعليمي</Text>
//         <Text style={styles.lessonContent}>
//           {selectedLesson.content.split('\n').join('\n\n')}
//         </Text>
//       </View>

//       {/* Fun Fact */}
//       <View style={styles.funFactCard}>
//         <Text style={styles.funFactIcon}>😲</Text>
//         <View style={styles.funFactContent}>
//           <Text style={styles.funFactLabel}>هل تعلم؟</Text>
//           <Text style={styles.funFactText}>{selectedLesson.funFact}</Text>
//         </View>
//       </View>

//       {/* Quiz Options */}
//       <View style={styles.quizSection}>
//         <Text style={styles.sectionTitle}>🎯 اختبر معرفتك</Text>
//         <Text style={styles.quizSubtitle}>
//           اختر مستوى الصعوبة:
//         </Text>

//         <View style={styles.difficultyOptions}>
//           {[
//             { id: 'EASY', label: 'سهل', icon: '🦁', color: '#10B981' },
//             { id: 'MEDIUM', label: 'متوسط', icon: '🧭', color: '#F59E0B' },
//             { id: 'HARD', label: 'صعب', icon: '⚔️', color: '#DC2626' }
//           ].map(diff => (
//             <TouchableOpacity
//               key={diff.id}
//               style={[styles.difficultyButton, { backgroundColor: diff.color }]}
//               onPress={() => onQuizComplete(Math.floor(Math.random() * 100))}
//             >
//               <Text style={styles.difficultyIcon}>{diff.icon}</Text>
//               <Text style={styles.difficultyLabel}>{diff.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Interactive Tools */}
//       <View style={styles.toolsSection}>
//         <TouchableOpacity style={styles.toolButton}>
//           <Text style={styles.toolIcon}>🕶️</Text>
//           <Text style={styles.toolText}>جولة 360°</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.toolButton, styles.toolButtonAR]}>
//           <Text style={styles.toolIcon}>📸</Text>
//           <Text style={styles.toolText}>تجربة AR</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );

//   const renderLearnTab = () => {
//     if (!selectedUnit) {
//       return renderUnits();
//     }
//     if (!selectedLesson) {
//       return renderLessonsList();
//     }
//     return renderLessonDetail();
//   };


//   // Passport Tab
//   const renderPassportTab = () => (
//     <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
//       <View style={styles.passportHeader}>
//         <View style={styles.passportAvatar}>
//           <Text style={styles.passportAvatarText}>👦</Text>
//         </View>
//         <Text style={styles.passportName}>المستكشف</Text>
//         <Text style={styles.passportLevel}>مغامر ذهبي</Text>
//         <Text style={styles.passportPoints}>
//           النقاط: {completedLessons.length * 150}
//         </Text>
        
//         <View style={styles.progressContainer}>
//           <View style={styles.progressBar}>
//             <View
//               style={[
//                 styles.progressFill,
//                 { width: `${Math.min((completedLessons.length / 4) * 100, 100)}%` }
//               ]}
//             />
//           </View>
//           <Text style={styles.progressText}>
//             {completedLessons.length} من 4 مهمة مكتملة
//           </Text>
//         </View>
//       </View>

//       <View style={styles.achievementsSection}>
//         <Text style={styles.achievementsTitle}>المهمات المنجزة 🏆</Text>
//         {completedLessons.length > 0 ? (
//           completedLessons.map(id => {
//             const lesson = CURRICULUM[0].lessons.find(l => l.id === id);
//             return (
//               <View key={id} style={styles.achievementCard}>
//                 <Text style={styles.achievementIcon}>✓</Text>
//                 <Text style={styles.achievementText}>{lesson?.title}</Text>
//               </View>
//             );
//           })
//         ) : (
//           <View style={styles.emptyAchievements}>
//             <Text style={styles.emptyAchievementsIcon}>🚀</Text>
//             <Text style={styles.emptyAchievementsText}>
//               لم تنجز أي مهمة بعد
//             </Text>
//             <Text style={styles.emptyAchievementsSubtext}>
//               ابدأ رحلتك الآن!
//             </Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Main Content */}
//       <View style={styles.mainContent}>
//         {activeTab === 'home' && renderHomeTab()}
//         {activeTab === 'learn' && renderLearnTab()}
//         {activeTab === 'passport' && renderPassportTab()}
//       </View>

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         {[
//           { id: 'home', label: 'الرئيسية', icon: 'home' },
//           { id: 'learn', label: 'دروسي', icon: 'book-open' },
//           { id: 'games', label: 'ألعاب', icon: 'gamepad-variant' },
//           { id: 'passport', label: 'إنجازاتي', icon: 'trophy' }
//         ].map(tab => (
//           <TouchableOpacity
//             key={tab.id}
//             style={[
//               styles.navButton,
//               activeTab === tab.id && styles.navButtonActive
//             ]}
//             onPress={() => {
//               setActiveTab(tab.id);
//               if (tab.id !== 'learn') {
//                 setSelectedUnit(null);
//                 setSelectedLesson(null);
//               }
//             }}
//           >
//             <Icon
//               name={tab.icon}
//               size={24}
//               color={activeTab === tab.id ? '#4F46E5' : '#9CA3AF'}
//             />
//             <Text style={[
//               styles.navLabel,
//               activeTab === tab.id && styles.navLabelActive
//             ]}>
//               {tab.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* AI Assistant Button */}
//       <TouchableOpacity
//         style={styles.aiButton}
//         onPress={() => setIsAiOpen(true)}
//       >
//         <Text style={styles.aiButtonIcon}>🤖</Text>
//       </TouchableOpacity>

//       {/* AI Modal */}
//       <Modal
//         visible={isAiOpen}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setIsAiOpen(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             {/* Modal Header */}
//             <View style={styles.modalHeader}>
//               <View>
//                 <Text style={styles.modalTitle}>المساعد الذكي</Text>
//                 <Text style={styles.modalSubtitle}>اسألني أي شيء</Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setIsAiOpen(false)}
//               >
//                 <Icon name="close" size={24} color="#FFF" />
//               </TouchableOpacity>
//             </View>

//             {/* Chat Area */}
//             <ScrollView style={styles.chatContainer}>
//               {aiLoading ? (
//                 <View style={styles.loadingContainer}>
//                   <ActivityIndicator size="large" color="#4F46E5" />
//                   <Text style={styles.loadingText}>جاري البحث...</Text>
//                 </View>
//               ) : aiResponse ? (
//                 <View style={styles.responseBubble}>
//                   <Text style={styles.responseText}>{aiResponse}</Text>
//                 </View>
//               ) : (
//                 <View style={styles.welcomeMessage}>
//                   <Text style={styles.welcomeIcon}>💬</Text>
//                   <Text style={styles.welcomeText}>
//                     مرحباً! أنا مساعدك الذكي. اسألني عن الجغرافيا أو أي موضوع تعليمي.
//                   </Text>
//                 </View>
//               )}
//             </ScrollView>

//             {/* Input Area */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.textInput}
//                 value={aiQuery}
//                 onChangeText={setAiQuery}
//                 placeholder="اكتب سؤالك هنا..."
//                 placeholderTextColor="#999"
//                 multiline
//                 textAlign="right"
//               />
//               <TouchableOpacity
//                 style={styles.sendButton}
//                 onPress={handleAiAsk}
//                 disabled={aiLoading}
//               >
//                 <Text style={styles.sendButtonText}>إرسال</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFF',
//   },
//   mainContent: {
//     flex: 1,
//   },
//   tabContent: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 20,
//     paddingBottom: 80,
//   },
//   fullScreenContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 60,
//     paddingBottom: 80,
//   },

//   // Home Tab
//   heroSection: {
//     backgroundColor: '#4F46E5',
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 20,
//     alignItems: 'flex-start',
//   },
//   heroTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFF',
//     lineHeight: 34,
//     marginBottom: 8,
//   },
//   heroHighlight: {
//     color: '#FBBF24',
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.9)',
//     marginBottom: 20,
//   },
//   startJourneyButton: {
//     backgroundColor: '#FBBF24',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   startJourneyText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1E40AF',
//   },
//   tasksSection: {
//     gap: 12,
//   },
//   taskCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 15,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   achievementCard: {
//     backgroundColor: '#4F46E5',
//   },
//   taskIcon: {
//     fontSize: 32,
//     marginRight: 12,
//   },
//   taskContent: {
//     flex: 1,
//   },
//   taskTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#3B82F6',
//     marginBottom: 4,
//   },
//   achievementTitle: {
//     color: '#FBBF24',
//   },
//   taskDescription: {
//     fontSize: 14,
//     color: '#666',
//   },
//   achievementDescription: {
//     color: 'rgba(255,255,255,0.9)',
//   },

//   // Units/Lessons
//   unitsHeader: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   unitsTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   unitsSubtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   unitsGrid: {
//     gap: 16,
//   },
//   unitCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 15,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   unitIconContainer: {
//     width: 50,
//     height: 50,
//     backgroundColor: '#DBEAFE',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   unitIcon: {
//     fontSize: 24,
//   },
//   unitTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   unitDescription: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 16,
//   },
//   unitArrow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   unitArrowText: {
//     fontSize: 14,
//     color: '#3B82F6',
//     fontWeight: '600',
//   },

//   // Back Button
//   backButton: {
//     position: 'absolute',
//     top: 10,
//     right: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   backButtonSmall: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: '#4F46E5',
//     marginRight: 4,
//   },
//   backButtonTextSmall: {
//     fontSize: 14,
//     color: '#4F46E5',
//     marginRight: 4,
//   },

//   // Lessons List
//   lessonsHeader: {
//     marginBottom: 20,
//   },
//   lessonsHeaderTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   lessonsHeaderSubtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   lessonsListContainer: {
//     flex: 1,
//   },
//   lessonCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 15,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   lessonCardActive: {
//     borderWidth: 2,
//     borderColor: '#4F46E5',
//   },
//   lessonCardHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   lessonNumber: {
//     width: 36,
//     height: 36,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   lessonNumberText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#4F46E5',
//   },
//   lessonCardInfo: {
//     flex: 1,
//     marginRight: 8,
//   },
//   lessonCardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   lessonCardDescription: {
//     fontSize: 14,
//     color: '#6B7280',
//     lineHeight: 20,
//   },
//   startLessonButton: {
//     backgroundColor: '#4F46E5',
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   startLessonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#FFF',
//   },

//   // Lesson Detail
//   lessonDetailHeader: {
//     marginBottom: 20,
//   },
//   lessonDetailTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     lineHeight: 32,
//   },
//   videoContainer: {
//     aspectRatio: 16/9,
//     backgroundColor: '#1F2937',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   videoPlaceholder: {
//     alignItems: 'center',
//   },
//   videoPlaceholderText: {
//     color: '#FFF',
//     fontSize: 16,
//     marginTop: 8,
//   },
//   contentSection: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 12,
//   },
//   lessonContent: {
//     fontSize: 16,
//     color: '#4B5563',
//     lineHeight: 24,
//     textAlign: 'right',
//   },
//   funFactCard: {
//     backgroundColor: '#FEF3C7',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   funFactIcon: {
//     fontSize: 32,
//     marginRight: 12,
//   },
//   funFactContent: {
//     flex: 1,
//   },
//   funFactLabel: {
//     fontSize: 12,
//     color: '#92400E',
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   funFactText: {
//     fontSize: 16,
//     color: '#92400E',
//     fontWeight: '600',
//   },
//   quizSection: {
//     marginBottom: 20,
//   },
//   quizSubtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginBottom: 16,
//   },
//   difficultyOptions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   difficultyButton: {
//     flex: 1,
//     marginHorizontal: 4,
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   difficultyIcon: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   difficultyLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   toolsSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   toolButton: {
//     flex: 1,
//     backgroundColor: '#7C3AED',
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   toolButtonAR: {
//     backgroundColor: '#059669',
//   },
//   toolIcon: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   toolText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#FFF',
//   },

//   // Passport Tab
//   passportHeader: {
//     backgroundColor: '#4F46E5',
//     borderRadius: 20,
//     padding: 24,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   passportAvatar: {
//     width: 80,
//     height: 80,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   passportAvatarText: {
//     fontSize: 40,
//   },
//   passportName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF',
//     marginBottom: 4,
//   },
//   passportLevel: {
//     fontSize: 16,
//     color: '#FBBF24',
//     marginBottom: 4,
//   },
//   passportPoints: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     marginBottom: 16,
//   },
//   progressContainer: {
//     width: '100%',
//   },
//   progressBar: {
//     height: 8,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 4,
//     overflow: 'hidden',
//     marginBottom: 8,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#FBBF24',
//     borderRadius: 4,
//   },
//   progressText: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//   },
//   achievementsSection: {
//     backgroundColor: '#FFF',
//     borderRadius: 20,
//     padding: 20,
//   },
//   achievementsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 16,
//   },
//   achievementCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 8,
//   },
//   achievementIcon: {
//     fontSize: 16,
//     color: '#10B981',
//     marginRight: 8,
//   },
//   achievementText: {
//     fontSize: 14,
//     color: '#374151',
//     flex: 1,
//   },
//   emptyAchievements: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyAchievementsIcon: {
//     fontSize: 48,
//     marginBottom: 12,
//   },
//   emptyAchievementsText: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     marginBottom: 4,
//   },
//   emptyAchievementsSubtext: {
//     fontSize: 14,
//     color: '#D1D5DB',
//   },

//   // Bottom Navigation
//   bottomNav: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     height: 60,
//   },
//   navButton: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
//   },
//   navButtonActive: {
//     borderTopWidth: 3,
//     borderTopColor: '#4F46E5',
//   },
//   navLabel: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginTop: 4,
//   },
//   navLabelActive: {
//     color: '#4F46E5',
//     fontWeight: '600',
//   },

//   // AI Assistant
//   aiButton: {
//     position: 'absolute',
//     bottom: 120,
//     left: 20,
//     width: 60,
//     height: 60,
//     backgroundColor: '#4F46E5',
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   aiButtonIcon: {
//     fontSize: 32,
//   },

//   // Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContainer: {
//     backgroundColor: '#FFF',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     backgroundColor: '#4F46E5',
//     padding: 16,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   chatContainer: {
//     padding: 16,
//     minHeight: 200,
//     maxHeight: 300,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#4F46E5',
//     marginTop: 12,
//   },
//   responseBubble: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     padding: 16,
//   },
//   responseText: {
//     fontSize: 16,
//     color: '#374151',
//     lineHeight: 24,
//     textAlign: 'right',
//   },
//   welcomeMessage: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   welcomeIcon: {
//     fontSize: 48,
//     marginBottom: 12,
//     opacity: 0.3,
//   },
//   welcomeText: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     textAlign: 'center',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   textInput: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#374151',
//     textAlignVertical: 'top',
//     maxHeight: 100,
//     marginRight: 12,
//   },
//   sendButton: {
//     backgroundColor: '#4F46E5',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 20,
//     justifyContent: 'center',
//   },
//   sendButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFF',
//   },
// });

// export default StudentDashboard;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const StudentDashboard = ({ navigation }) => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiResponse(`هذا رد ذكي من المساعد الجغرافي عن: "${aiQuery}"\n\nالمغرب العربي منطقة غنية بالتنوع الجغرافي والثقافي. الدول الخمس لكل منها عاصمة مميزة وتاريخ عريق.`);
      setAiLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            استكشف عالمك {'\n'}
            <Text style={styles.heroHighlight}>بذكاء!</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            حوّل درس الجغرافيا إلى مغامرة رقمية
          </Text>
          <TouchableOpacity 
            style={styles.startJourneyButton}
            onPress={() => navigation.navigate('Lessons')}
          >
            <Text style={styles.startJourneyText}>ابدأ الرحلة 🚀</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Tasks */}
        <View style={styles.tasksSection}>
          <View style={styles.taskCard}>
            <Text style={styles.taskIcon}>🧭</Text>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>مهمة اليوم</Text>
              <Text style={styles.taskDescription}>
                اكتشف الفرق بين المناخ المتوسطي والصحراوي
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.taskCard, styles.achievementCard]}
            onPress={() => navigation.navigate('Trophy')}
          >
            <Text style={styles.taskIcon}>🏆</Text>
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, styles.achievementTitle]}>أعلى نتيجة</Text>
              <Text style={[styles.taskDescription, styles.achievementDescription]}>
                أحمد حصل على 500 نقطة في تحدي السياحة
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.taskCard}
            onPress={() => navigation.navigate('Games')}
          >
            <Text style={styles.taskIcon}>🎮</Text>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>الألعاب</Text>
              <Text style={styles.taskDescription}>
                العب وتعلم مع ألعاب الجغرافيا التفاعلية
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>إحصائيات سريعة</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>دروس مكتملة</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>ألعاب لُعبت</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>420</Text>
              <Text style={styles.statLabel}>نقطة</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* AI Assistant Button */}
      <TouchableOpacity 
        style={styles.aiButton}
        onPress={() => setIsAiOpen(true)}
      >
        <Text style={styles.aiButtonIcon}>🤖</Text>
      </TouchableOpacity>

      {/* AI Modal */}
      <Modal
        visible={isAiOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAiOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>المساعد الذكي</Text>
                <Text style={styles.modalSubtitle}>اسألني أي شيء</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsAiOpen(false)}
              >
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatContainer}>
              {aiLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4F46E5" />
                  <Text style={styles.loadingText}>جاري البحث...</Text>
                </View>
              ) : aiResponse ? (
                <View style={styles.responseBubble}>
                  <Text style={styles.responseText}>{aiResponse}</Text>
                </View>
              ) : (
                <View style={styles.welcomeMessage}>
                  <Text style={styles.welcomeIcon}>💬</Text>
                  <Text style={styles.welcomeText}>
                    مرحباً! أنا مساعدك الذكي. اسألني عن الجغرافيا أو أي موضوع تعليمي.
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={aiQuery}
                onChangeText={setAiQuery}
                placeholder="اكتب سؤالك هنا..."
                placeholderTextColor="#999"
                multiline
                textAlign="right"
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleAiAsk}
                disabled={aiLoading}
              >
                <Text style={styles.sendButtonText}>إرسال</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heroSection: {
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 34,
    marginBottom: 8,
  },
  heroHighlight: {
    color: '#FBBF24',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
  },
  startJourneyButton: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startJourneyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  tasksSection: {
    gap: 12,
    marginBottom: 24,
  },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementCard: {
    backgroundColor: '#4F46E5',
  },
  taskIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
    textAlign: 'right',
  },
  achievementTitle: {
    color: '#FBBF24',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  achievementDescription: {
    color: 'rgba(255,255,255,0.9)',
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  aiButton: {
    position: 'absolute',
    bottom: 20,
    opacity:0.8,
    left: 20,
    width: 60,
    height: 60,
    backgroundColor: '#4F46E5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiButtonIcon: {
    fontSize: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  closeButton: {
    padding: 4,
  },
  chatContainer: {
    padding: 16,
    minHeight: 200,
    maxHeight: 300,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4F46E5',
    marginTop: 12,
  },
  responseBubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  responseText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'right',
  },
  welcomeMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.3,
  },
  welcomeText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    textAlignVertical: 'top',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default StudentDashboard;