import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const handleCancel = (id: number) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const confirmCancel = async () => {
    if (selectedId === null) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      await API.delete(`/my-excursions/${selectedId}/cancel/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExcursions((prev) => prev.filter((e) => e.id !== selectedId));
      setModalVisible(false);
      setSelectedId(null);
    } catch (error: any) {
      console.error('Ошибка отмены:', error?.response?.data || error.message || error);
      Alert.alert('Ошибка', 'Не удалось отменить заявку');
    }
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
        {item.comment?.trim() ? (
          <Text>Комментарий: {item.comment}</Text>
        ) : null}

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
        <ActivityIndicator size="large" color="#B10000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={excursions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={
          excursions.length === 0 ? styles.emptyContainer : styles.list
        }
        ListEmptyComponent={<Text style={styles.empty}>Заявок пока нет</Text>}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Вы уверены, что хотите отменить заявку?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#B10000' }]}
                onPress={confirmCancel}
              >
                <Text style={styles.modalButtonText}>Да</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
