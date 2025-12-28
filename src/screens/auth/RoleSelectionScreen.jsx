import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
    ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const UserRole = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  PARENT: 'parent',
  ADMIN: 'admin'
};

const RoleSelectionScreen = ({ navigation }) => {
  const [activeRole, setActiveRole] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleRoleSelect = (role) => {
    setActiveRole(role);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();

   setTimeout(() => {
    navigation.navigate('AuthSelection', { role });
  }, 200);
  };

  const roleOptions = [
    {
      role: UserRole.STUDENT,
      title: 'فضاء التلميذ',
      description: 'دروس تفاعلية، AR، وتحديات',
      icon: '🎒',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      borderColor: '#60A5FA'
    },
    {
      role: UserRole.TEACHER,
      title: 'فضاء المعلم',
      description: 'متابعة الأداء وإدارة المنهج',
      icon: '👨‍🏫',
      color: '#10B981',
      bgColor: '#D1FAE5',
      borderColor: '#34D399'
    },
    {
      role: UserRole.PARENT,
      title: 'فضاء الولي',
      description: 'تقارير التقدم والتواصل مع المدرسة',
      icon: '👨‍👩‍👧',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      borderColor: '#A78BFA'
    }
  ];

  const renderRoleButton = (option) => {
    const isActive = activeRole === option.role;
    
    return (
      <TouchableOpacity
        key={option.role}
        onPress={() => handleRoleSelect(option.role)}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.roleButton,
            {
              backgroundColor: option.bgColor,
              borderColor: isActive ? option.color : option.borderColor,
              borderWidth: isActive ? 3 : 2,
              transform: [{ scale: isActive ? scaleAnim : 1 }]
            }
          ]}
        >
          <View style={styles.roleContent}>
            <Text style={[styles.roleIcon, { fontSize: 40 }]}>
              {option.icon}
            </Text>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>
                {option.title}
              </Text>
              <Text style={styles.roleDescription}>
                {option.description}
              </Text>
            </View>
          </View>
          
          {isActive && (
            <View style={[styles.activeIndicator, { backgroundColor: option.color }]} />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>جغرافي</Text>
          <Text style={styles.headerSubtitle}>اختر فضاء الدخول</Text>
        </View>

        <View style={styles.content}>
          {roleOptions.map(renderRoleButton)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            اختر الفضاء المناسب لدخولك إلى عالم الجغرافيا التفاعلي
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  content: {
    marginBottom: 40,
  },
  roleButton: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  roleIcon: {
    marginLeft: 16,
  },
  roleTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'right',
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  activeIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default RoleSelectionScreen;