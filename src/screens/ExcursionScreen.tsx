import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ExcursionSlot = {
  id: number;
  date: string;
  time: string;
  capacity: number;
  available_slots: number;
};

const ExcursionScreen = () => {
  const [slots, setSlots] = useState<ExcursionSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ExcursionSlot | null>(null);
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userSlotIds, setUserSlotIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');

        const slotRes = await API.get('/excursion-slots/');
        setSlots(slotRes.data);

        const myRes = await API.get('/my-excursions/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserSlotIds(myRes.data.map((order: any) => order.slot));
      } catch (e) {
        Alert.alert('Ошибка', 'Не удалось загрузить данные');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedSlot) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      await API.post(
        '/excursions/',
        { slot: selectedSlot.id, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Успех', 'Вы успешно записались на экскурсию!');
      setModalVisible(false);
      setComment('');
      setSelectedSlot(null);
    } catch (error: any) {
      if (error.response?.data?.non_field_errors) {
        Alert.alert('Ошибка', error.response.data.non_field_errors[0]);
      } else {
        Alert.alert('Ошибка', 'Не удалось записаться на экскурсию');
      }
    }
  };

  const renderItem = ({ item }: { item: ExcursionSlot }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedSlot(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.cardTitle}>{item.date} в {item.time}</Text>
      <Text style={styles.cardText}>
        Свободно мест: {item.available_slots} / {item.capacity}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#B10000" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/1633925944.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Экскурсии</Text>

        <FlatList
          data={slots.filter(slot => !userSlotIds.includes(slot.id))}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        <Modal visible={modalVisible} transparent animationType="fade">

          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {selectedSlot?.date} в {selectedSlot?.time}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Комментарий (необязательно)"
                value={comment}
                onChangeText={setComment}
                multiline
              />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Записаться</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

export default ExcursionScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 30,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B10000',
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#B10000',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#B10000',
  },
});
