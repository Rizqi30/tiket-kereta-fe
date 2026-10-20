'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { useBookingStore } from '@/store/bookingStore';
import { Clock, ChevronRight, Filter, Zap, Train, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSelectedSchedule } = useBookingStore();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('departure');

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        if (from && to && date) {
          const response = await apiClient.searchSchedules(from, to, date);
          setSchedules(response.data);
        } else {
          // Data demo
          setSchedules([
            {
              id: '1',
              train: { name: 'Argo Bromo Anggrek', code: 'ABA-001' },
              departureStation: { code: 'GMR', name: 'Jakarta Gambir' },
              arrivalStation: { code: 'SGU', name: 'Surabaya Gubeng' },
              departureTime: '2026-05-28T06:00:00',
              arrivalTime: '2026-05-28T14:30:00',
              duration: 510,
              price: 450000,
              availableSeats: 45,
            },
            {
              id: '2',
              train: { name: 'Argo Wilis', code: 'AW-002' },
              departureStation: { code: 'GMR', name: 'Jakarta Gambir' },
              arrivalStation: { code: 'SGU', name: 'Surabaya Gubeng' },
              departureTime: '2026-05-28T08:30:00',
              arrivalTime: '2026-05-28T17:00:00',
              duration: 510,
              price: 380000,
              availableSeats: 32,
            },
            {
              id: '3',
              train: { name: 'Taksaka', code: 'TKS-001' },
              departureStation: { code: 'GMR', name: 'Jakarta Gambir' },
              arrivalStation: { code: 'YK', name: 'Yogyakarta Tugu' },
              departureTime: '2026-05-28T07:15:00',
              arrivalTime: '2026-05-28T14:45:00',
              duration: 450,
              price: 350000,
              availableSeats: 28,
            },
            {
              id: '4',
              train: { name: 'Argo Parahyangan', code: 'AP-001' },
              departureStation: { code: 'GMR', name: 'Jakarta Gambir' },
              arrivalStation: { code: 'BD', name: 'Bandung' },
              departureTime: '2026-05-28T09:00:00',
              arrivalTime: '2026-05-28T11:30:00',
              duration: 150,
              price: 150000,
              availableSeats: 56,
            },
          ]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat jadwal');
        // Gunakan data demo jika error
        setSchedules([
          {
            id: '1',
            train: { name: 'Argo Bromo Anggrek', code: 'ABA-001' },
            departureStation: { code: 'GMR', name: 'Jakarta Gambir' },
            arrivalStation: { code: 'SGU', name: 'Surabaya Gubeng' },
            departureTime: '2026-05-28T06:00:00',
            arrivalTime: '2026-05-28T14:30:00',
            duration: 510,
            price: 450000,
            availableSeats: 45,
          },
          {
            id: '2',
            train: { name: 'Argo Wilis', code: 'AW-002' },
            departureStation: { code: 'GMR', name: 'Jakarta Gambir' },
            arrivalStation: { code: 'SGU', name: 'Surabaya Gubeng' },
            departureTime: '2026-05-28T08:30:00',
            arrivalTime: '2026-05-28T17:00:00',
            duration: 510,
            price: 380000,
            availableSeats: 32,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [from, to, date]);

  const handleSelectTrain = (schedule: any) => {
    setSelectedSchedule(schedule);
    router.push(`/train/${schedule.id}`);
  };

  const sortedSchedules = [...schedules].sort((a, b) => {
    if (sortBy === 'departure') {
      return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    } else if (sortBy === 'price') {
      return (a.price || 0) - (b.price || 0);
    } else if (sortBy === 'duration') {
      return (a.duration || 0) - (b.duration || 0);
    }
    return 0;
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

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
              <span className="gradient-text">Kereta Tersedia</span>
            </h1>
            <p className="text-muted-foreground">
              Ditemukan {schedules.length} kereta 
              {date && <span> untuk tanggal <span className="font-semibold text-foreground">{date}</span></span>}
            </p>
          </motion.div>

          {/* Route Summary */}
          {(from || to) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <MapPin className="w-5 h-5 text-accent mx-auto mb-2" />
                  <p className="text-lg font-semibold text-foreground">Jakarta</p>
                  <p className="text-sm text-muted-foreground">Keberangkatan</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px w-20 bg-gradient-to-r from-primary to-accent" />
                  <ArrowRight className="w-5 h-5 text-accent" />
                  <div className="h-px w-20 bg-gradient-to-r from-accent to-primary" />
                </div>
                <div className="text-center">
                  <MapPin className="w-5 h-5 text-accent mx-auto mb-2" />
                  <p className="text-lg font-semibold text-foreground">Surabaya</p>
                  <p className="text-sm text-muted-foreground">Tujuan</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters */}
          {!loading && schedules.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Urutkan:</span>
              </div>
              <div className="flex gap-3">
                {[
                  { key: 'departure', label: 'Waktu Berangkat' },
                  { key: 'price', label: 'Harga' },
                  { key: 'duration', label: 'Durasi' },
                ].map((option) => (
                  <Button
                    key={option.key}
                    variant={sortBy === option.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy(option.key)}
                    className={sortBy === option.key 
                      ? 'bg-primary text-primary-foreground' 
                      : 'border-border text-foreground hover:bg-primary/10'
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                </div>
                <p className="text-muted-foreground">Memuat kereta tersedia...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && schedules.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-12 text-center"
            >
              <Train className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-foreground mb-2">Tidak ada kereta tersedia</p>
              <p className="text-muted-foreground mb-6">
                Tidak ditemukan kereta untuk tanggal dan rute yang dipilih.
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-blue"
                onClick={() => router.push('/')}
              >
                Kembali ke Pencarian
              </Button>
            </motion.div>
          )}

          {/* Results */}
          {!loading && schedules.length > 0 && (
            <div className="space-y-4">
              {sortedSchedules.map((schedule, index) => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass-card rounded-2xl p-6 hover:border-primary/40 transition-all group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                    {/* Train Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Train className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{schedule.train?.name || 'Kereta Ekspres'}</p>
                          <p className="text-xs text-muted-foreground font-mono">{schedule.train?.code || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Departure */}
                    <div className="lg:col-span-1 text-center lg:text-left">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Berangkat</p>
                      <p className="text-2xl font-bold text-foreground">
                        {new Date(schedule.departureTime).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{schedule.departureStation?.code}</p>
                    </div>

                    {/* Duration */}
                    <div className="lg:col-span-1 flex justify-center">
                      <div className="text-center">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
                          <Clock className="w-5 h-5 text-accent" />
                          <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">{formatDuration(schedule.duration)}</p>
                        <p className="text-xs text-muted-foreground">Langsung</p>
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="lg:col-span-1 text-center lg:text-left">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tiba</p>
                      <p className="text-2xl font-bold text-foreground">
                        {new Date(schedule.arrivalTime).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{schedule.arrivalStation?.code}</p>
                    </div>

                    {/* Seats */}
                    <div className="lg:col-span-1 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tersedia</p>
                      <p className={`text-lg font-bold ${schedule.availableSeats < 10 ? 'text-destructive' : 'text-accent'}`}>
                        {schedule.availableSeats} kursi
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="lg:col-span-1 flex flex-col items-center lg:items-end gap-3">
                      <div className="text-center lg:text-right">
                        <p className="text-xs text-muted-foreground mb-1">Mulai dari</p>
                        <p className="text-2xl font-bold gradient-text">
                          Rp {(schedule.price || 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleSelectTrain(schedule)}
                        className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-blue transition-all"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Pilih
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
