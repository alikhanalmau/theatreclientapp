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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Animated } from 'react-native';


const screenHeight = Dimensions.get('window').height;

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    const latinRegex = /^[A-Za-z0-9_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    } else if (!latinRegex.test(username)) {
      newErrors.username = 'Только латинские буквы и цифры';
    }

    if (!email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Некорректный email';
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

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await axios.post('https://theatreservice.onrender.com/api/register/', {
        username,
        email,
        password,
      });

      Alert.alert('Успешно!', 'Теперь войдите в аккаунт');
      navigation.replace('Login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка регистрации:', error.response?.data || error.message);

        const responseErrors = error.response?.data;
        const newErrors: typeof errors = {};

        if (responseErrors?.username?.[0]) {
          const message = responseErrors.username[0];
          newErrors.username =
            message === 'A user with that username already exists.'
              ? 'Пользователь с таким именем уже существует'
              : message;
        }

        if (responseErrors?.email?.[0]) {
          const message = responseErrors.email[0];
          newErrors.email =
            message === 'A user is already registered with this e-mail address.'
              ? 'Пользователь с таким email уже зарегистрирован'
              : message;
        }

        if (responseErrors?.password?.[0]) {
          newErrors.password = responseErrors.password[0];
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
          Alert.alert('Ошибка', 'Проверьте введённые данные');
        }
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Ошибка', 'Что-то пошло не так');
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
            <Text style={styles.headerText}>Регистрация</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Имя пользователя"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <Pressable
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.button,
                pressed && { backgroundColor: 'rgba(178, 34, 34, 0.7)' },
              ]}
            >
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </Pressable>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default RegisterScreen;

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
  errorText: {
    color: 'red',
    marginTop: -8,
    marginBottom: 8,
    fontSize: 13,
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
});
