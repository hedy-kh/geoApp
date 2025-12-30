import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UnitsScreen from './studentLessons/UnitsScreen';
import LessonDetailScreen from './studentLessons/LessonDetailScreen';
import LessonsListScreen from './studentLessons/LessonsListScreen';
import StudentARScreen from './studentLessons/StudentARScreen';
const Stack = createStackNavigator();

const StudentLessonsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#F8FAFF" },
      }}
    >
      <Stack.Screen name="Units" component={UnitsScreen} />
      <Stack.Screen name="LessonsList" component={LessonsListScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
      <Stack.Screen name="StudentARScreen" component={StudentARScreen} />
    </Stack.Navigator>
  );
};

export default StudentLessonsStack;