import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Excursion = {
  id: number;
  comment: string;
  created_at: string;
  slot: {
    date: string;
    time: string;
  };
};

const MyExcursionsScreen = () => {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExcursions();
  }, []);

  const fetchExcursions = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await API.get('/my-excursions/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExcursions(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке экскурсий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    Alert.alert('Подтверждение', 'Вы уверены, что хотите отменить заявку?', [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Да',
        onPress: async () => {
          try {
            await API.delete(`/my-excursions/${id}/cancel/`);
            setExcursions((prev) => prev.filter((e) => e.id !== id));
            Alert.alert('Успешно', 'Заявка отменена');
          } catch (error) {
            console.error('Ошибка отмены:', error);
            Alert.alert('Ошибка', 'Не удалось отменить заявку');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Excursion }) => {
    if (!item.slot) {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>Слот не найден</Text>
          <Text>Комментарий: {item.comment || '—'}</Text>
          <Text style={styles.date}>
            Заявка отправлена: {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      );
    }
  
    const formattedDate = new Date(item.slot.date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  
    const formattedTime = item.slot.time?.slice(0, 5);
  
    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          Экскурсия: {formattedDate} в {formattedTime}
        </Text>
        <Text>Комментарий: {item.comment || '—'}</Text>
        <Text style={styles.date}>
          Заявка отправлена: {new Date(item.created_at).toLocaleString()}
        </Text>
        <TouchableOpacity
          onPress={() => handleCancel(item.id)}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelBtnText}>Отменить заявку</Text>
        </TouchableOpacity>
      </View>
    );
  };


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={excursions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={excursions.length === 0 ? styles.emptyContainer : styles.list}
      ListEmptyComponent={<Text style={styles.empty}>Заявок пока нет</Text>}
    />
  );

};

export default MyExcursionsScreen;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  empty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    marginTop: 6,
    color: '#666',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    marginTop: 10,
    backgroundColor: '#ffe6e6',
    padding: 8,
    borderRadius: 6,
  },
  cancelBtnText: {
    color: '#a00',
    textAlign: 'center',
    fontWeight: '500',
  },
});
