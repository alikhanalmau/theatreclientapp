import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import type { Event } from '../types/models';

const EventsScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/events/');
        const baseURL = API.defaults.baseURL;
        const updatedEvents = response.data.map((event: Event) => ({
          ...event,
          image: event.image.startsWith('http')
            ? event.image
            : `${baseURL}${event.image}`,
        }));
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Ошибка при загрузке афиши:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetail', { event: item })}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      </View>
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
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Казахский Национальный театр{'\n'}оперы и балета им. Абая
          </Text>
        </View>

        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </View>
    </ImageBackground>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.60)', // или прозрачность для читаемости
  },
  header: {
    height: 100,
    backgroundColor: 'rgba(178, 34, 34, 0.5)',
    opacity: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 8,
    elevation: 3,
  },
  image: {
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
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
});
