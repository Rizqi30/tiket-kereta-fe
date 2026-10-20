'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { Schedule, Seat, TrainClass } from '@/types';
import {
  Clock,
  MapPin,
  ChevronLeft,
  AlertCircle,
  Check,
  Train,
  Users,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrainDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.id as string;
  const { isAuthenticated } = useAuthStore();
  const { 
    selectedSchedule,
    setSchedule, 
    selectedSeats, 
    addSeat, 
    removeSeat, 
    setPassengers,
    setSelectedClass 
  } = useBookingStore();

  const [schedule, setScheduleData] = useState<Schedule | null>(selectedSchedule);
  const [classes, setClasses] = useState<TrainClass[]>([]);
  const [currentClass, setCurrentClass] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await apiClient.getSchedule(scheduleId);
        const scheduleData = response.data;
        setScheduleData(scheduleData);
        setClasses(scheduleData.train?.classes || []);
        if (scheduleData.train?.classes && scheduleData.train.classes.length > 0) {
          setCurrentClass(scheduleData.train.classes[0].id);
        }
      } catch (err: any) {
        setError('Gagal memuat detail jadwal');
        // Data demo
        const mockSchedule: Schedule = {
          id: scheduleId,
          trainId: '1',
          train: { 
            id: '1', 
            name: 'Argo Bromo Anggrek', 
            code: 'ABA-001',
            classes: [
              { id: 'exec', name: 'Eksekutif', price: 450000, capacity: 48, amenities: ['AC', 'Wifi', 'Makanan'] },
              { id: 'biz', name: 'Bisnis', price: 350000, capacity: 64, amenities: ['AC', 'Wifi'] },
              { id: 'eco', name: 'Ekonomi', price: 250000, capacity: 80, amenities: ['AC'] },
            ]
          },
          departureStationId: '1',
          departureStation: { id: '1', name: 'Jakarta Gambir', code: 'GMR', city: 'Jakarta' },
          arrivalStationId: '2',
          arrivalStation: { id: '2', name: 'Surabaya Gubeng', code: 'SGU', city: 'Surabaya' },
          departureTime: '06:00',
          arrivalTime: '14:30',
          duration: 510,
          date: '2026-05-28',
          price: 450000,
          availableSeats: 45,
        };
        setScheduleData(mockSchedule);
        setClasses(mockSchedule.train?.classes || []);
        if (mockSchedule.train?.classes && mockSchedule.train.classes.length > 0) {
          setCurrentClass(mockSchedule.train.classes[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!currentClass) return;

      try {
        const response = await apiClient.getSeats(scheduleId, currentClass);
        setSeats(response.data);
      } catch (err) {
        // Generate mock seats
        const mockSeats: Seat[] = [];
        const selectedClassData = classes.find(c => c.id === currentClass);
        const capacity = selectedClassData?.capacity || 48;
        
        for (let i = 0; i < capacity; i++) {
          const row = Math.floor(i / 4) + 1;
          const col = (i % 4) + 1;
          const letter = ['A', 'B', 'C', 'D'][col - 1];
          mockSeats.push({
            id: `seat-${currentClass}-${i}`,
            number: `${row}${letter}`,
            classId: currentClass,
            isAvailable: Math.random() > 0.3,
            carriageNumber: Math.floor(i / 16) + 1,
            row,
            column: col,
          });
        }
        setSeats(mockSeats);
      }
    };

    fetchSeats();
  }, [scheduleId, currentClass, classes]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;

    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      removeSeat(seat.id);
    } else {
      addSeat(seat);
    }
  };

  const handleProceedToBooking = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (schedule && selectedSeats.length > 0) {
      setSchedule(schedule);
      setSelectedClass(currentClass || '');
      setPassengers(
        selectedSeats.map(() => ({
          name: '',
          email: '',
          phone: '',
          idNumber: '',
        }))
      );
      router.push('/booking');
    }
  };

  const selectedClassData = classes.find((c) => c.id === currentClass);
  const totalPrice = selectedSeats.length * (selectedClassData?.price || 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  // Group seats by carriage
  const seatsByCarriage = seats.reduce((acc, seat) => {
    const carriage = seat.carriageNumber || 1;
    if (!acc[carriage]) acc[carriage] = [];
    acc[carriage].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            </div>
            <p className="text-muted-foreground">Memuat detail kereta...</p>
          </div>
        </div>
      </>
    );
  }

  if (!schedule && error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center glass-card rounded-2xl p-12">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <p className="text-xl text-foreground mb-4">{error || 'Jadwal tidak ditemukan'}</p>
            <Button onClick={() => router.push('/search')} className="bg-primary text-primary-foreground">
              Kembali ke Pencarian
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ChevronLeft className="w-5 h-5" />
              Kembali ke Pencarian
            </Link>

            {/* Train Info Card */}
            <div className="glass-card rounded-2xl p-8">
              <div className="grid md:grid-cols-4 gap-8 items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-2xl">
                    <Train className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {schedule?.train?.name}
                    </h1>
                    <p className="text-muted-foreground font-mono">{schedule?.train?.code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 col-span-2 justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{schedule?.departureTime}</p>
                    <p className="text-sm text-muted-foreground">{schedule?.departureStation?.code}</p>
                    <p className="text-xs text-muted-foreground">{schedule?.departureStation?.city}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
                      <Clock className="w-5 h-5 text-accent" />
                      <div className="h-px w-12 bg-gradient-to-r from-primary to-transparent" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      {formatDuration(schedule?.duration || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{schedule?.arrivalTime}</p>
                    <p className="text-sm text-muted-foreground">{schedule?.arrivalStation?.code}</p>
                    <p className="text-xs text-muted-foreground">{schedule?.arrivalStation?.city}</p>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-sm text-muted-foreground mb-1">Kursi Tersedia</p>
                  <p className="text-3xl font-bold text-accent">{schedule?.availableSeats}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Seat Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Class Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">Pilih Kelas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {classes.map((trainClass) => (
                    <div
                      key={trainClass.id}
                      className={`glass-card rounded-xl p-5 cursor-pointer transition-all ${
                        currentClass === trainClass.id
                          ? 'border-primary border-2 bg-primary/5'
                          : 'hover:border-primary/40'
                      }`}
                      onClick={() => setCurrentClass(trainClass.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground">{trainClass.name}</h3>
                        {currentClass === trainClass.id && (
                          <div className="bg-primary rounded-full p-1">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-2xl font-bold gradient-text mb-2">
                        Rp {trainClass.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-muted-foreground">{trainClass.capacity} kursi</p>
                      {trainClass.amenities && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {trainClass.amenities.map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Seat Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Pilih Kursi ({selectedSeats.length} dipilih)
                </h2>

                <div className="glass-card rounded-2xl p-8">
                  {/* Seat Legend */}
                  <div className="flex flex-wrap gap-6 mb-8 justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground text-xs">
                        ✕
                      </div>
                      <span className="text-sm text-muted-foreground">Terisi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg border border-primary/30 flex items-center justify-center text-primary text-xs font-semibold">
                        1A
                      </div>
                      <span className="text-sm text-muted-foreground">Tersedia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary rounded-lg border-2 border-primary flex items-center justify-center glow-blue">
                        <Check className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">Dipilih</span>
                    </div>
                  </div>

                  {/* Seats Grid by Carriage */}
                  <div className="space-y-8">
                    {Object.entries(seatsByCarriage).map(([carriage, carriageSeats]) => (
                      <div key={carriage}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-primary/10 px-3 py-1 rounded-lg">
                            <span className="text-sm font-semibold text-primary">Gerbong {carriage}</span>
                          </div>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                          {carriageSeats.map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            return (
                              <motion.button
                                key={seat.id}
                                whileHover={{ scale: seat.isAvailable ? 1.1 : 1 }}
                                whileTap={{ scale: seat.isAvailable ? 0.95 : 1 }}
                                onClick={() => handleSeatClick(seat)}
                                disabled={!seat.isAvailable}
                                className={`
                                  aspect-square rounded-lg flex items-center justify-center text-xs font-semibold
                                  transition-all
                                  ${
                                    !seat.isAvailable
                                      ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                                      : isSelected
                                        ? 'bg-primary text-primary-foreground border-2 border-primary glow-blue'
                                        : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 cursor-pointer'
                                  }
                                `}
                              >
                                {isSelected && <Check className="w-4 h-4" />}
                                {!isSelected && !seat.isAvailable && '✕'}
                                {!isSelected && seat.isAvailable && seat.number}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold text-foreground">Ringkasan Pesanan</h3>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kereta</span>
                    <span className="font-semibold text-foreground">{schedule?.train?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kelas</span>
                    <span className="font-semibold text-foreground">{selectedClassData?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rute</span>
                    <span className="font-semibold text-foreground">
                      {schedule?.departureStation?.code} → {schedule?.arrivalStation?.code}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kursi</span>
                    <span className="font-semibold text-foreground">
                      {selectedSeats.length > 0 
                        ? selectedSeats.map((s) => s.number).join(', ')
                        : '-'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Harga per kursi</span>
                    <span className="font-semibold text-foreground">
                      Rp {(selectedClassData?.price || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-lg text-foreground">Total</span>
                    <span className="text-3xl font-bold gradient-text">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="mb-4 p-4 bg-accent/10 border border-accent/30 rounded-xl text-sm text-accent">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Silakan masuk untuk melanjutkan pemesanan
                  </div>
                )}

                <Button
                  onClick={handleProceedToBooking}
                  disabled={selectedSeats.length === 0}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-blue transition-all"
                >
                  {isAuthenticated ? 'Lanjutkan Pemesanan' : 'Masuk untuk Pesan'}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
