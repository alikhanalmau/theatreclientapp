import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (e) {
    console.error('Ошибка получения токена:', e);
    return null;
  }
};