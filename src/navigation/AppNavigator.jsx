import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import ParentDashboard from '../screens/parent/ParentDashboard';
import StudentDashboard from '../screens/student/StudentDashboard';
import StudentGamesScreen from '../screens/student/StudentGamesScreen';
import StudentLessonsStack from '../screens/student/StudentLessonsStack';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LogoutScreen from '../screens/LogoutScreen';
import ChildProgressScreen from '../screens/parent/ChildProgressScreen';
import CommunicationsScreen from '../screens/parent/CommunicationsScreen';
import StudentTrophy from '../screens/student/StudentTrophy';
import MemoryGameScreen from '../screens/student/games/MemoryGameScreen';
import AdventureGameScreen from '../screens/student/games/AdventureGameScreen';
import PuzzleGameScreen from '../screens/student/games/PuzzleGameScreen';
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const StudentGamesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GamesList" component={StudentGamesScreen} />
      <Stack.Screen name="MemoryGame" component={MemoryGameScreen} />
      <Stack.Screen name="PuzzleGame" component={PuzzleGameScreen} />
      <Stack.Screen name="AdventureGame" component={AdventureGameScreen} />
    </Stack.Navigator>
  );
};
const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="StudentHome"
        component={StudentDashboard}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Lessons"
        component={StudentLessonsStack}
        options={{
          tabBarLabel: 'دروسي',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Games"
        component={StudentGamesStack} 
        options={{
          tabBarLabel: 'الألعاب',
          tabBarIcon: ({ color, size }) => (
            <Icon name="gamepad-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name='Trophy' component={StudentTrophy}
        options={{
          tabBarLabel: 'إنجازاتي',
          tabBarIcon: ({color,size}) => (
            <Icon name='trophy' size={size} color={color}/>
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'حسابي',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const TeacherDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#4F46E5',
        drawerInactiveTintColor: '#374151',
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 300, 
        },
        headerShown:false,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginRight: 0, 
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#374151',
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
      initialRouteName="TeacherDashboard"
    >
      <Drawer.Screen 
        name="TeacherDashboard" 
        component={TeacherDashboard}
        options={{
          drawerLabel: 'لوحة التحكم',
          title: 'لوحة تحكم المعلم',
          drawerIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerLabel: 'الملف الشخصي',
          title: 'الملف الشخصي',
          drawerIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerLabel: 'الإعدادات',
          title: 'الإعدادات',
          drawerIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Logout" 
        component={LogoutScreen}
        options={{
          drawerLabel: 'تسجيل الخروج',
          title: 'تسجيل الخروج',
          drawerIcon: ({ color, size }) => (
            <Icon name="logout" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const ParentDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#8B5CF6',
        drawerInactiveTintColor: '#374151',
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginRight: -20,
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="ParentDashboard"
        component={ParentDashboard}
        options={{
          drawerLabel: 'لوحة المتابعة',
          drawerIcon: ({ color, size }) => (
            <Icon name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ChildProgress"
        component={ChildProgressScreen}
        options={{
          drawerLabel: 'تقدم الأبناء',
          drawerIcon: ({ color, size }) => (
            <Icon name="school" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Communications"
        component={CommunicationsScreen}
        options={{
          drawerLabel: 'التواصل',
          drawerIcon: ({ color, size }) => (
            <Icon name="message-text" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: 'الملف الشخصي',
          drawerIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          drawerLabel: 'تسجيل الخروج',
          drawerIcon: ({ color, size }) => (
            <Icon name="logout" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = ({ route }) => {
  const { role } = route.params;

  switch (role) {
    case 'student':
      return <StudentTabNavigator />;
    case 'teacher':
      return <TeacherDrawerNavigator />;
    case 'parent':
      return <ParentDrawerNavigator />;
    default:
      return <StudentTabNavigator />;
  }
};

export default AppNavigator;