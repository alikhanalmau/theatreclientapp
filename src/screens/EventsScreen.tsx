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
  const formatDateRu = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetail', { event: item })}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{formatDateRu(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large"  color="#B10000"/>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/1633925944.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Казахский Национальный театр{'\n'}оперы и балета им. Абая
        </Text>
      </View>
      <View style={styles.overlay}>
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
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  header: {
    backgroundColor: 'rgba(178, 34, 34, 0.85)',
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
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
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.93)',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
