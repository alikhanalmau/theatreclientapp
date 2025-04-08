import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventsScreen from '../screens/EventsScreen';
import ExcursionScreen from '../screens/ExcursionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import ProfileNavigator from './ProfileNavigator';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'Афиша') iconName = 'film-outline';
          if (route.name === 'Экскурсия') iconName = 'calendar-outline';
          if (route.name === 'Профиль') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: 'rgba(178, 34, 34, 1)',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Афиша" component={EventsScreen} />
      <Tab.Screen name="Экскурсия" component={ExcursionScreen} />
      <Tab.Screen name="Профиль" component={ProfileNavigator} />

    </Tab.Navigator>
  );
};

export default TabNavigator;
