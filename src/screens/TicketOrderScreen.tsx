import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import API from '../api/api';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TicketOrderRouteProp = RouteProp<RootStackParamList, 'TicketOrder'>;

const TicketOrderScreen = () => {
  const { params } = useRoute<TicketOrderRouteProp>();
  const { event } = params;

  const [count, setCount] = useState('1');
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBooking = async () => {
    try {
      await API.post('/tickets/', {
        event: event,
        count: parseInt(count, 10),
        comment,
      });

      setModalVisible(true);

      setCount('1');
      setComment('');
    } catch (err) {
      console.error('Ошибка бронирования:', err);
      Alert.alert('Ошибка', 'Не удалось забронировать билет');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{new Date(event.date).toLocaleString()}</Text>

      <Text style={styles.label}>Количество билетов</Text>
      <TextInput
        style={styles.input}
        value={count}
        onChangeText={setCount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Комментарий</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={comment}
        onChangeText={setComment}
        multiline
        placeholder="Необязательно"
      />

      <Button title="Забронировать" onPress={handleBooking} />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Успешно!</Text>
            <Text style={styles.modalText}>
              Тут должна быть интеграция с Ticketon, но пока её нет. Билет забронирован.
            </Text>
            <Pressable style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>Ок</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TicketOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    marginBottom: 20,
    color: '#666',
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#13447E',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
