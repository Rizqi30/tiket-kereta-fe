// User & Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'PENUMPANG' | 'PETUGAS';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Train Types
export interface TrainClass {
  id: string;
  name: string;
  price: number;
  capacity: number;
  amenities: string[];
}

export interface Train {
  id: string;
  name: string;
  code: string;
  classes: TrainClass[];
}

export interface Station {
  id: string;
  name: string;
  code: string;
  city: string;
}

export interface Schedule {
  id: string;
  trainId: string;
  train?: Train;
  departureStationId: string;
  departureStation?: Station;
  arrivalStationId: string;
  arrivalStation?: Station;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  date: string;
  price: number;
  availableSeats: number;
}

export interface Seat {
  id: string;
  number: string;
  classId: string;
  isAvailable: boolean;
  carriageNumber: number;
  row: number;
  column: number;
}

export interface Ticket {
  id: string;
  userId: string;
  scheduleId: string;
  schedule?: Schedule;
  seatId: string;
  seat?: Seat;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  passengerIdNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  bookingDate: string;
  createdAt: string;
}

export interface BookingRequest {
  scheduleId: string;
  classId: string;
  seats: string[];
  passengers: {
    name: string;
    email: string;
    phone: string;
    idNumber: string;
  }[];
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalTicketsSold: number;
  totalRevenue: number;
  activeSchedules: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  ticketsSold: number;
}
