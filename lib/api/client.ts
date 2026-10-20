import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  // Auth endpoints
  login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  register(name: string, email: string, password: string, phone: string) {
    return this.client.post('/auth/register', { name, email, password, phone });
  }

  getMe() {
    return this.client.get('/auth/me');
  }

  // Station endpoints
  getStations() {
    return this.client.get('/stations');
  }

  // Schedule endpoints
  searchSchedules(departureStationId: string, arrivalStationId: string, date: string) {
    return this.client.get('/schedules', {
      params: { departureStationId, arrivalStationId, date },
    });
  }

  // Alternative search using query params format from Postman
  searchJadwal(asal: string, tujuan: string, kelas: string, tanggal: string) {
    return this.client.get('/jadwal', {
      params: { asal, tujuan, kelas, tanggal },
    });
  }

  getSchedule(id: string) {
    return this.client.get(`/schedules/${id}`);
  }

  getSeats(scheduleId: string, classId: string) {
    return this.client.get(`/schedules/${scheduleId}/seats`, {
      params: { classId },
    });
  }

  // Ticket endpoints
  bookTicket(bookingData: {
    jadwalId?: string;
    scheduleId?: string;
    classId?: string;
    seats?: string[];
    penumpang?: any[];
    passengers?: any[];
  }) {
    // Support both API formats
    return this.client.post('/tickets', bookingData);
  }

  getMyTickets() {
    return this.client.get('/tickets/my');
  }

  getTicket(id: string) {
    return this.client.get(`/tickets/${id}`);
  }

  cancelTicket(id: string) {
    return this.client.delete(`/tickets/${id}`);
  }

  // Admin endpoints
  getUsers() {
    return this.client.get('/admin/users');
  }

  getTrains() {
    return this.client.get('/admin/trains');
  }

  createTrain(trainData: any) {
    return this.client.post('/admin/trains', trainData);
  }

  updateTrain(id: string, trainData: any) {
    return this.client.put(`/admin/trains/${id}`, trainData);
  }

  deleteTrain(id: string) {
    return this.client.delete(`/admin/trains/${id}`);
  }

  getSchedules(params?: any) {
    return this.client.get('/admin/schedules', { params });
  }

  createSchedule(scheduleData: any) {
    return this.client.post('/admin/schedules', scheduleData);
  }

  updateSchedule(id: string, scheduleData: any) {
    return this.client.put(`/admin/schedules/${id}`, scheduleData);
  }

  deleteSchedule(id: string) {
    return this.client.delete(`/admin/schedules/${id}`);
  }

  getTickets(params?: any) {
    return this.client.get('/admin/tickets', { params });
  }

  getRevenue(startDate?: string, endDate?: string) {
    return this.client.get('/admin/revenue', {
      params: { startDate, endDate },
    });
  }

  getDashboardStats() {
    return this.client.get('/admin/stats');
  }
}

export const apiClient = new APIClient();
