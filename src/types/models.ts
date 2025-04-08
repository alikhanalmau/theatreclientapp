export type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

export type TicketOrder = {
  id: number;
  user: User;
  event: Event;
  count: number;
  status: 'reserved' | 'paid' | 'cancelled';
  comment?: string;
  created_at: string;
};


export type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    username: string;
  };
};
