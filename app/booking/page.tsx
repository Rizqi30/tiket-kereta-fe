'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api/client';
import {
  AlertCircle,
  User,
  Mail,
  Phone,
  CreditCard,
  ChevronLeft,
  Train,
  Clock,
  Sparkles,
  Lock,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BookingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { selectedSchedule, selectedSeats, passengers, selectedClass, setPassengers, clearBooking } = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Penumpang, 2: Pembayaran

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!selectedSchedule || selectedSeats.length === 0) {
      router.push('/search');
    }
  }, [isAuthenticated, selectedSchedule, selectedSeats, router]);

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value,
    };
    setPassengers(newPassengers);
  };

  const validatePassengers = () => {
    for (const passenger of passengers) {
      if (!passenger.name || !passenger.idNumber) {
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validatePassengers()) {
      setStep(2);
    } else {
      setError('Silakan isi semua data penumpang yang wajib');
    }
  };

  const handleBooking = async () => {
    setError('');
    setLoading(true);

    try {
      const bookingData = {
        scheduleId: selectedSchedule?.id,
        seatIds: selectedSeats.map((s) => s.id),
        passengers: passengers,
        classId: selectedClass,
      };

      const response = await apiClient.createBooking(bookingData);
      const { bookingId } = response.data;
      clearBooking();
      router.push(`/booking/${bookingId}/success`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Pemesanan gagal. Silakan coba lagi.');
      // Untuk demo, simulasi sukses
      setTimeout(() => {
        clearBooking();
        router.push('/dashboard');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const classInfo = selectedSchedule?.train?.classes?.find(c => c.id === selectedClass);
  const pricePerSeat = classInfo?.price || selectedSchedule?.price || 0;
  const totalPrice = selectedSeats.length * pricePerSeat;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  if (!selectedSchedule || selectedSeats.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center glass-card rounded-2xl p-12">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <p className="text-xl text-foreground mb-4">Tidak ada informasi pemesanan</p>
            <Button onClick={() => router.push('/search')} className="bg-primary text-primary-foreground">
              Cari Kereta
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href={`/train/${selectedSchedule.id}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ChevronLeft className="w-5 h-5" />
              Kembali ke Pemilihan Kursi
            </Link>

            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Selesaikan Pemesanan</span>
            </h1>
            <p className="text-muted-foreground">Masukkan data penumpang dan informasi pembayaran</p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${step >= 1 ? 'bg-primary text-primary-foreground glow-blue' : 'bg-muted'}`}>
                  {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                </div>
                <span className="font-semibold hidden sm:block">Penumpang</span>
              </div>
              <div className={`h-1 w-20 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${step >= 2 ? 'bg-primary text-primary-foreground glow-blue' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
                <span className="font-semibold hidden sm:block">Pembayaran</span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Trip Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Train className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{selectedSchedule.train?.name}</h3>
                    <p className="text-sm text-muted-foreground">Kelas {classInfo?.name || 'Standar'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{selectedSchedule.departureTime}</p>
                    <p className="text-sm text-muted-foreground">{selectedSchedule.departureStation?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
                    <Clock className="w-5 h-5 text-accent" />
                    <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{selectedSchedule.arrivalTime}</p>
                    <p className="text-sm text-muted-foreground">{selectedSchedule.arrivalStation?.name}</p>
                  </div>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}

              {step === 1 && (
                /* Passenger Forms */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-foreground">Data Penumpang</h2>
                  {passengers.map((passenger, index) => (
                    <div key={index} className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">Penumpang {index + 1}</h3>
                          <p className="text-sm text-muted-foreground">
                            Kursi: <span className="font-semibold text-accent">{selectedSeats[index]?.number}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Nama Lengkap <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              type="text"
                              value={passenger.name}
                              onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                              placeholder="Sesuai identitas"
                              required
                              className="pl-12 h-12 bg-input/50 border-border rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Nomor Identitas <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              type="text"
                              value={passenger.idNumber}
                              onChange={(e) => handlePassengerChange(index, 'idNumber', e.target.value)}
                              placeholder="Nomor KTP/Paspor"
                              required
                              className="pl-12 h-12 bg-input/50 border-border rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              type="email"
                              value={passenger.email}
                              onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                              placeholder="email@contoh.com"
                              className="pl-12 h-12 bg-input/50 border-border rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Telepon
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              type="tel"
                              value={passenger.phone}
                              onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                              placeholder="+62-812-3456-7890"
                              className="pl-12 h-12 bg-input/50 border-border rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={handleNextStep}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-blue"
                  >
                    Lanjutkan ke Pembayaran
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                /* Payment Form */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-foreground">Detail Pembayaran</h2>
                  
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Pembayaran Aman</h3>
                        <p className="text-sm text-muted-foreground">Pembayaran Anda dienkripsi dan aman</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Nomor Kartu
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            className="pl-12 h-12 bg-input/50 border-border rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Tanggal Kedaluwarsa
                          </label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
                            className="h-12 bg-input/50 border-border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            CVV
                          </label>
                          <Input
                            type="text"
                            placeholder="123"
                            className="h-12 bg-input/50 border-border rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Nama Pemegang Kartu
                        </label>
                        <Input
                          type="text"
                          placeholder="Nama di kartu"
                          className="h-12 bg-input/50 border-border rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="h-12 border-border text-foreground hover:bg-muted rounded-xl"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Kembali
                    </Button>
                    <Button
                      onClick={handleBooking}
                      disabled={loading}
                      className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-blue"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Memproses...
                        </span>
                      ) : (
                        `Bayar Rp ${totalPrice.toLocaleString('id-ID')}`
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
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
                    <span className="font-semibold text-foreground">{selectedSchedule.train?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kelas</span>
                    <span className="font-semibold text-foreground">{classInfo?.name || 'Standar'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tanggal</span>
                    <span className="font-semibold text-foreground">{selectedSchedule.date || '28 Mei 2026'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rute</span>
                    <span className="font-semibold text-foreground">
                      {selectedSchedule.departureStation?.code} → {selectedSchedule.arrivalStation?.code}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Penumpang</span>
                    <span className="font-semibold text-foreground">{selectedSeats.length} orang</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kursi</span>
                    <span className="font-semibold text-foreground">
                      {selectedSeats.map((s) => s.number).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {selectedSeats.length}x Tiket
                    </span>
                    <span className="text-foreground">
                      Rp {(pricePerSeat * selectedSeats.length).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Layanan</span>
                    <span className="text-foreground">Rp 0</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-4">
                  <span className="text-lg text-foreground">Total</span>
                  <span className="text-3xl font-bold gradient-text">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Harga sudah termasuk pajak. Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
