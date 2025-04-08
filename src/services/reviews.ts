import API from '../api/api';

export const getReviewsForEvent = (eventId: number) => {
  return API.get(`/reviews/?event=${eventId}`);
};

export const postReview = (data: {
  event: number;
  rating: number;
  comment: string;
}) => {
  return API.post('/reviews/', data);
};
