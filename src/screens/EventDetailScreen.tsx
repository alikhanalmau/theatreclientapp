import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, Button, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Review } from '../types/models';
import { getReviewsForEvent, postReview } from '../services/reviews';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

const EventDetailScreen = () => {
  const { params } = useRoute<EventDetailRouteProp>();
  const { event } = params;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(5);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


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
      fetchReviews(); // обновим список
    } catch (err) {
      console.error('Ошибка отправки отзыва', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.image }} style={styles.image} />
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{new Date(event.date).toLocaleString()}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Button
        title="Забронировать билет"
        color="#13447E"
        onPress={() => navigation.navigate('TicketOrder', { event })}
      />


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
        <Button title="Отправить" onPress={handleSubmit} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Отзывы</Text>
        {reviews.map((r) => (
          <View key={r.id} style={styles.review}>
            <Text style={styles.reviewUser}>{r.user.username}</Text>
            <Text style={styles.reviewRating}>Оценка: {r.rating}</Text>
            <Text>{r.comment}</Text>
            <Text style={styles.reviewDate}>
              {new Date(r.created_at).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default EventDetailScreen;


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
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
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
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
