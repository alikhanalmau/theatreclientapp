import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EventsScreen from '../screens/EventsScreen';
import ExcursionScreen from '../screens/ExcursionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ActivityIndicator, View } from 'react-native';
import { navigationRef } from './RootNavigation';
import TabNavigator from './TabNavigator';
import { useAuth } from '../context/AuthContext';
import EventDetailScreen from '../screens/EventDetailScreen';
import type { Event } from '../types/models';
import TicketOrderScreen from '../screens/TicketOrderScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Events: undefined;
  Excursion: undefined;
  Profile: undefined;
  MainTabs: undefined;
  EventDetail: { event: Event };
  TicketOrder: { event: Event };

};




const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {

  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }} // скрываем только на главных вкладках
            />
            <Stack.Screen
              name="Events"
              component={EventsScreen}
              options={{ title: 'Афиша' }}
            />
            <Stack.Screen
              name="EventDetail"
              component={EventDetailScreen}
              options={{ title: 'Мероприятие' }} // ✅ покажет заголовок и кнопку назад
            />
            <Stack.Screen
              name="TicketOrder"
              component={TicketOrderScreen}
              options={{ title: 'Заказ билета' }}
            />
            <Stack.Screen
              name="Excursion"
              component={ExcursionScreen}
              options={{ title: 'Экскурсия' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Профиль', headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default AppNavigator;
