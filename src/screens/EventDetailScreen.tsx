import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Review } from '../types/models';
import { getReviewsForEvent, postReview } from '../services/reviews';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

const EventDetailScreen = () => {
  const { params } = useRoute<EventDetailRouteProp>();
  const { event } = params;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(5);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const averageRating =
  reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;


  const fetchReviews = async () => {
    try {
      const res = await getReviewsForEvent(event.id);
      setReviews(res.data);
    } catch (err) {
      console.error('Ошибка загрузки отзывов', err);
    }
  };

  const handleSubmit = async () => {
    try {
      await postReview({ event: event.id, rating, comment });
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error('Ошибка отправки отзыва', err);
    }
  };

  useEffect(() => {
    fetchReviews();
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

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.image }} style={styles.image} />
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{formatDateRu(event.date)}</Text>
      {averageRating ? (
        <Text style={styles.rating}>Рейтинг: {averageRating} / 5</Text>
      ) : (
        <Text style={styles.rating}>Рейтинг: нет данных</Text>
      )}

      <Text style={styles.description}>{event.description}</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('TicketOrder', { event })}>
        <Text style={styles.buttonText}>Забронировать билет</Text>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Оставить отзыв</Text>
        <TextInput
          placeholder="Комментарий"
          value={comment}
          onChangeText={setComment}
          style={styles.input}
          multiline
        />
        <TextInput
          placeholder="Оценка (1–5)"
          keyboardType="numeric"
          value={String(rating)}
          onChangeText={(val) => setRating(Number(val))}
          style={styles.input}
        />
        <Pressable style={styles.buttonAlt} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Отправить</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Отзывы</Text>
        {reviews.map((r) => (
          <View key={r.id} style={styles.review}>
            <Text style={styles.reviewUser}>{r.user.username}</Text>
            <Text style={styles.reviewRating}>Оценка: {r.rating}</Text>
            <Text>{r.comment}</Text>
            <Text style={styles.reviewDate}>{formatDateRu(r.created_at)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  rating: {
    fontSize: 16,
    fontWeight: '500',
    color: '#13447E',
    marginBottom: 12,
  },

  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    color: '#777',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#B10000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonAlt: {
    backgroundColor: '#13447E',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
  },
  review: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  reviewUser: {
    fontWeight: 'bold',
  },
  reviewRating: {
    color: '#13447E',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
