import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

const screenHeight = Dimensions.get('window').height;

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const { refreshAuth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const validate = () => {
    const newErrors: typeof errors = {};
    const latinRegex = /^[A-Za-z0-9_]+$/;

    if (!username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    } else if (!latinRegex.test(username)) {
      newErrors.username = 'Только латинские буквы и цифры';
    }

    if (!password) {
      newErrors.password = 'Введите пароль';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    } else if (!latinRegex.test(password)) {
      newErrors.password = 'Только латинские буквы и цифры';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const response = await axios.post('https://theatreservice.onrender.com/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;

      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);
      await AsyncStorage.setItem('username', username);
      await refreshAuth();

      Alert.alert('Успешный вход!');
      navigation.replace('MainTabs')

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error.response?.data || error.message);
        setErrors((prev) => ({
          ...prev,
          username: 'Неверные имя пользователя или пароль',
        }));
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Ошибка', 'Произошла неизвестная ошибка');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/1633925944.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.dimOverlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Вход</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Имя пользователя"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors((prev) => ({ ...prev, username: undefined }));
              }}
            />
            {errors.username && <Text style={styles.error}>{errors.username}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.button,
                pressed && { backgroundColor: 'rgba(178, 34, 34, 0.7)' }, 
              ]}
            >
              <Text style={styles.buttonText}>Войти</Text>
            </Pressable>


            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    height: screenHeight,
    width: '100%',
    position: 'relative',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    backgroundColor: 'rgba(178, 34, 34, 0.7)',
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#B22222',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: 'rgba(178, 34, 34, 0.7)',
    marginTop: 16,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: -10,
    marginBottom: 8,
  },
});
