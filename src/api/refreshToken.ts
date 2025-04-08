import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const refreshAccessToken = async (): Promise<string | null> => {
    const refresh = await AsyncStorage.getItem('refreshToken');
    if (!refresh) return null;
  
    try {
      const response = await axios.post('https://theatreservice.onrender.com/api/token/refresh/', {
        refresh,
      });
  
      const { access } = response.data;
      await AsyncStorage.setItem('accessToken', access);
      return access;
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      return null;
    }
  };