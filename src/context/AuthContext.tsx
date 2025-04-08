import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
  user: { username: string } | null; 
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  refreshAuth: async () => {},
  logout: async () => {},
  user: null, 
});



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);


  const refreshAuth = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      // Пример: извлекаем имя из AsyncStorage или расшифровываем токен
      const username = await AsyncStorage.getItem('username'); // если хранишь имя
      setUser(username ? { username } : null);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    setIsLoading(false);
  };
  

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, refreshAuth, logout, user }}>
      {children}
    </AuthContext.Provider>

  );
};


export const useAuth = () => useContext(AuthContext);
