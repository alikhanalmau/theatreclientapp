import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
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
        event: event.id,
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
    <ScrollView style={styles.container}>
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

      <Pressable style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Забронировать</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Билет успешно забронирован! {'\n'}(Интеграция с Ticketon будет позже)
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#13447E' }]}
                onPress={handleModalClose}
              >
                <Text style={styles.modalButtonText}>Ок</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

export default TicketOrderScreen;

const styles = StyleSheet.create({
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },

  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    color: '#777',
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#B10000',
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
