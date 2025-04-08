import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
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
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userSlotIds, setUserSlotIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchSlotsAndOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');

        const slotsResponse = await API.get('/excursion-slots/');
        setSlots(slotsResponse.data);

        const ordersResponse = await API.get('/my-excursions/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookedSlotIds = ordersResponse.data.map((order: any) => order.slot);
        setUserSlotIds(bookedSlotIds);
      } catch (error) {
        console.error('Ошибка при загрузке:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlotsAndOrders();
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

      Alert.alert('Успешно', 'Вы записались на экскурсию!');
      setComment('');
      setSelectedSlot(null);
      setModalVisible(false);
    } catch (error: any) {
      if (error.response?.data?.non_field_errors) {
        Alert.alert('Ошибка', error.response.data.non_field_errors[0]);
      } else {
        Alert.alert('Ошибка', 'Не удалось записаться на экскурсию');
      }
      console.error('Ошибка при записи:', error);
    }
  };

  const renderItem = ({ item }: { item: ExcursionSlot }) => (
    <TouchableOpacity
      style={styles.slot}
      onPress={() => {
        setSelectedSlot(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.slotText}>
        {item.date} в {item.time}
      </Text>
      <Text style={styles.slotText}>
        Свободно мест: {item.available_slots} из {item.capacity}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
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
        <Text style={styles.title}>Выберите экскурсию:</Text>

        <FlatList
          data={slots.filter((slot) => !userSlotIds.includes(slot.id))}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedSlot?.date} в {selectedSlot?.time}
              </Text>

              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Ваш комментарий (необязательно)"
                style={styles.input}
                multiline
              />

              <Button title="Записаться" onPress={handleSubmit} />
              <Button title="Отмена" onPress={() => setModalVisible(false)} />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 16,
  },
  slot: {
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  slotText: {
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    minHeight: 60,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});
