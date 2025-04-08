import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/ProfileNavigator';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { logout, user } = useAuth(); // предполагается, что ты хранишь данные о пользователе

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/avatar.png')}
        style={styles.avatar}
      />
      <Text style={styles.name}>Привет, {user?.username || 'Гость'}!</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Мои экскурсии"
          onPress={() => navigation.navigate('MyExcursions')}
        />
        <View style={styles.space} />
        <Button
          title="Мои заказы"
          onPress={() => navigation.navigate('MyOrders')}

        />
        <View style={styles.space} />
        <Button title="Выйти" onPress={logout} />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '80%',
  },
  space: {
    height: 12,
  },
});
