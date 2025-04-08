import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import MyExcursionsScreen from '../screens/MyExcursionsScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';

export type ProfileStackParamList = {
    ProfileMain: undefined;
    MyExcursions: undefined;
    MyOrders: undefined;
  };
  

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'rgba(178, 34, 34, 1)',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      >
        <Stack.Screen
          name="ProfileMain"
          component={ProfileScreen}
          options={{ title: 'Профиль' }}
        />
        <Stack.Screen
          name="MyExcursions"
          component={MyExcursionsScreen}
          options={{ title: 'Мои экскурсии' }}
        />
        <Stack.Screen
          name="MyOrders"
          component={MyOrdersScreen}
          options={{ title: 'Мои заказы' }}
        />
      </Stack.Navigator>
    );
  };
  
export default ProfileNavigator;
