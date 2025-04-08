import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { logout, user } = useAuth();

  return (
    <ImageBackground
      source={require('../../assets/1633925944.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require('../../assets/avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>Привет, {user?.username || 'Гость'}!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MyExcursions')}
          >
            <Text style={styles.buttonText}>Мои экскурсии</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MyOrders')}
          >
            <Text style={styles.buttonText}>Мои заказы</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Выйти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ProfileScreen;



const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.50)',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
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
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: 'rgba(178, 34, 34, 0.85)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
