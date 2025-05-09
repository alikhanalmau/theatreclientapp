import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TicketOrder } from '../types/models';

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await API.get('/tickets/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: TicketOrder }) => {
    const formattedDate = item.event?.date
      ? new Date(item.event.date).toLocaleString()
      : 'Неизвестно';
  
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.event?.title || 'Без названия'}</Text>
        <Text style={styles.label}>🎭 Дата спектакля: <Text style={styles.value}>{formattedDate}</Text></Text>
        <Text style={styles.label}>🎫 Кол-во билетов: <Text style={styles.value}>{item.count}</Text></Text>
        <Text style={styles.label}>📌 Статус: <Text style={styles.value}>{item.status}</Text></Text>
        {item.comment ? (
          <Text style={styles.label}>💬 Комментарий: <Text style={styles.value}>{item.comment}</Text></Text>
        ) : null}
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
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={orders.length === 0 ? styles.emptyContainer : styles.list}
      ListEmptyComponent={
        <Text style={styles.emptyText}>У вас нет заказов</Text>
      }
    />
  );

};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  emptyContainer: {
  flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },

  list: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontWeight: '500',
    marginTop: 4,
  },
  value: {
    fontWeight: '400',
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
