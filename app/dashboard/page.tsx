'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api/client';
import { Booking } from '@/types';
import {
  Train,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Ticket,
  User,
  History,
  LogOut,
  Settings,
  CreditCard,
  Search,
  Download,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await apiClient.getUserBookings();
        setBookings(response.data);
      } catch (err) {
        // Data demo
        setBookings([
          {
            id: '1',
            userId: user?.id || '1',
            scheduleId: '1',
            schedule: {
              id: '1',
              trainId: '1',
              train: { id: '1', name: 'Argo Bromo Anggrek', code: 'ABA-001' },
              departureStationId: '1',
              departureStation: { id: '1', name: 'Jakarta Gambir', code: 'GMR', city: 'Jakarta' },
              arrivalStationId: '2',
              arrivalStation: { id: '2', name: 'Surabaya Gubeng', code: 'SGU', city: 'Surabaya' },
              departureTime: '06:00',
              arrivalTime: '14:30',
              duration: 510,
              date: '2026-06-15',
              price: 450000,
              availableSeats: 45,
            },
            status: 'CONFIRMED',
            totalPrice: 450000,
            createdAt: new Date().toISOString(),
            passengers: [{ name: 'Budi Santoso', seatNumber: '1A' }],
          },
          {
            id: '2',
            userId: user?.id || '1',
            scheduleId: '2',
            schedule: {
              id: '2',
              trainId: '2',
              train: { id: '2', name: 'Argo Parahyangan', code: 'AP-001' },
              departureStationId: '1',
              departureStation: { id: '1', name: 'Jakarta Gambir', code: 'GMR', city: 'Jakarta' },
              arrivalStationId: '3',
              arrivalStation: { id: '3', name: 'Bandung', code: 'BD', city: 'Bandung' },
              departureTime: '09:00',
              arrivalTime: '11:30',
              duration: 150,
              date: '2026-05-10',
              price: 150000,
              availableSeats: 56,
            },
            status: 'COMPLETED',
            totalPrice: 300000,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            passengers: [
              { name: 'Budi Santoso', seatNumber: '3A' },
              { name: 'Siti Rahayu', seatNumber: '3B' },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, router, user?.id]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'PENDING'
  );
  const historyBookings = bookings.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'CANCELLED'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Terkonfirmasi
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-semibold">
            <AlertCircle className="w-3 h-3" />
            Menunggu
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Selesai
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Dasbor Saya</span>
            </h1>
            <p className="text-muted-foreground">
              Selamat datang kembali, {user?.name || 'Penumpang'}!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 glow-blue">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">{user?.name || 'Penumpang'}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email || 'user@email.com'}</p>
                </div>

                {/* Menu */}
                <nav className="space-y-2">
                  <button
                    onClick={() => router.push('/search')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Search className="w-5 h-5" />
                    Cari Kereta
                  </button>
                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary"
                  >
                    <Ticket className="w-5 h-5" />
                    Pesanan Saya
                  </button>
                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <CreditCard className="w-5 h-5" />
                    Metode Pembayaran
                  </button>
                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="w-5 h-5" />
                    Pengaturan
                  </button>
                  <div className="pt-4 border-t border-border mt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 transition-colors text-destructive"
                    >
                      <LogOut className="w-5 h-5" />
                      Keluar
                    </button>
                  </div>
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3 space-y-6"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Perjalanan', value: bookings.length, icon: Train },
                  { label: 'Akan Datang', value: upcomingBookings.length, icon: Calendar },
                  { label: 'Selesai', value: historyBookings.filter(b => b.status === 'COMPLETED').length, icon: CheckCircle },
                  { label: 'Total Pengeluaran', value: `Rp ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString('id-ID')}`, icon: CreditCard },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="glass-card rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Tabs */}
              <div className="glass-card rounded-2xl p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeTab === 'upcoming'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Akan Datang ({upcomingBookings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeTab === 'history'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    Riwayat ({historyBookings.length})
                  </button>
                </div>
              </div>

              {/* Bookings List */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                    </div>
                    <p className="text-muted-foreground">Memuat pesanan...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {(activeTab === 'upcoming' ? upcomingBookings : historyBookings).length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                      <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-xl text-foreground mb-2">
                        Tidak ada pesanan {activeTab === 'upcoming' ? 'yang akan datang' : 'sebelumnya'}
                      </p>
                      <p className="text-muted-foreground mb-6">
                        {activeTab === 'upcoming'
                          ? 'Pesan perjalanan kereta Anda sekarang!'
                          : 'Perjalanan yang telah selesai akan muncul di sini'}
                      </p>
                      {activeTab === 'upcoming' && (
                        <Button
                          onClick={() => router.push('/search')}
                          className="bg-primary text-primary-foreground glow-blue"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Cari Kereta
                        </Button>
                      )}
                    </div>
                  ) : (
                    (activeTab === 'upcoming' ? upcomingBookings : historyBookings).map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="glass-card rounded-2xl p-6 hover:border-primary/40 transition-all"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                          {/* Train Info */}
                          <div className="flex items-center gap-4 lg:w-48">
                            <div className="bg-primary/10 p-3 rounded-xl">
                              <Train className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground">
                                {booking.schedule?.train?.name}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {booking.schedule?.train?.code}
                              </p>
                            </div>
                          </div>

                          {/* Journey Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {formatDate(booking.schedule?.date || '')}
                            </div>
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-xl font-bold text-foreground">
                                  {booking.schedule?.departureTime}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.schedule?.departureStation?.code}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="h-px w-8 bg-border" />
                                <Clock className="w-4 h-4 text-accent" />
                                <span className="text-xs text-muted-foreground">
                                  {formatDuration(booking.schedule?.duration || 0)}
                                </span>
                                <div className="h-px w-8 bg-border" />
                              </div>
                              <div>
                                <p className="text-xl font-bold text-foreground">
                                  {booking.schedule?.arrivalTime}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.schedule?.arrivalStation?.code}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Passengers */}
                          <div className="lg:w-32 text-center lg:text-left">
                            <p className="text-xs text-muted-foreground mb-1">Penumpang</p>
                            <p className="font-semibold text-foreground">
                              {booking.passengers?.length || 1} orang
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Kursi: {booking.passengers?.map(p => p.seatNumber).join(', ') || 'N/A'}
                            </p>
                          </div>

                          {/* Price & Status */}
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(booking.status)}
                            <p className="text-xl font-bold gradient-text">
                              Rp {booking.totalPrice.toLocaleString('id-ID')}
                            </p>
                            {booking.status === 'CONFIRMED' && (
                              <Button
                                size="sm"
                                className="bg-primary/10 text-primary hover:bg-primary/20"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                E-Tiket
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
