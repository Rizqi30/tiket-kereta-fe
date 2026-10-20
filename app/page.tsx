'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api/client';
import { Station } from '@/types';
import { 
  ChevronRight, 
  Train, 
  Zap, 
  Shield, 
  Clock, 
  MapPin, 
  Calendar,
  Star,
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [stations, setStations] = useState<Station[]>([]);
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await apiClient.getStations();
        setStations(response.data);
      } catch (err) {
        console.error('Gagal memuat stasiun:', err);
        // Data stasiun untuk demo
        setStations([
          { id: '1', name: 'Jakarta Gambir', code: 'GMR', city: 'Jakarta' },
          { id: '2', name: 'Bandung', code: 'BD', city: 'Bandung' },
          { id: '3', name: 'Surabaya Gubeng', code: 'SGU', city: 'Surabaya' },
          { id: '4', name: 'Yogyakarta Tugu', code: 'YK', city: 'Yogyakarta' },
          { id: '5', name: 'Semarang Tawang', code: 'SMT', city: 'Semarang' },
        ]);
      }
    };
    fetchStations();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departure || !arrival || !date) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from: departure,
        to: arrival,
        date: date,
      });
      router.push(`/search?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Super Cepat',
      description: 'Jadwal real-time dan konfirmasi pemesanan instan',
    },
    {
      icon: Shield,
      title: 'Pemesanan Aman',
      description: 'Enkripsi tingkat enterprise untuk semua transaksi',
    },
    {
      icon: Clock,
      title: 'Layanan 24/7',
      description: 'Bantuan pelanggan sepanjang waktu',
    },
    {
      icon: Train,
      title: 'Jaringan Luas',
      description: 'Akses ribuan kereta di seluruh Indonesia',
    },
  ];

  const stats = [
    { value: '10JT+', label: 'Penumpang Puas' },
    { value: '500+', label: 'Rute Kereta' },
    { value: '99.9%', label: 'Waktu Aktif' },
    { value: '4.9★', label: 'Rating Aplikasi' },
  ];

  const popularRoutes = [
    { from: 'Jakarta', to: 'Bandung', price: 'Rp 150.000', duration: '2j 30m' },
    { from: 'Jakarta', to: 'Surabaya', price: 'Rp 450.000', duration: '8j 15m' },
    { from: 'Jakarta', to: 'Yogyakarta', price: 'Rp 350.000', duration: '7j 30m' },
    { from: 'Bandung', to: 'Surabaya', price: 'Rp 380.000', duration: '6j 45m' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background overflow-hidden">
        {/* Hero Section with Full Width Image */}
        <section className="relative min-h-[90vh] flex items-center justify-center">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/hero-train.jpg"
              alt="Pengalaman Kereta Premium"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
          </div>

          {/* Animated Background Elements */}
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{ 
              y: [0, 50, 0], 
              x: [0, 30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
            animate={{ 
              y: [0, -40, 0], 
              x: [0, -20, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Platform Pemesanan Kereta Premium</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
                <span className="text-foreground">Pesan Tiket Kereta,</span>
                <br />
                <span className="gradient-text text-glow">Perjalanan Lebih Cerdas</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Nikmati pemesanan tiket kereta yang mudah dengan jadwal real-time, kursi premium, dan konfirmasi instan
              </p>
            </motion.div>

            {/* Booking Search Form - Glassmorphism Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card rounded-3xl p-8 max-w-5xl mx-auto shadow-2xl"
            >
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* From Station */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    Dari
                  </label>
                  <select
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="bg-input/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="">Pilih keberangkatan</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Station */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    Ke
                  </label>
                  <select
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className="bg-input/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="">Pilih tujuan</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Tanggal
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-input/50 border-border rounded-xl px-4 py-3 h-auto"
                  />
                </div>

                {/* Passengers */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    Penumpang
                  </label>
                  <select className="bg-input/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <option value="1">1 Dewasa</option>
                    <option value="2">2 Dewasa</option>
                    <option value="3">3 Dewasa</option>
                    <option value="4">4 Dewasa</option>
                  </select>
                </div>

                {/* Search Button */}
                <div className="flex flex-col justify-end">
                  <Button
                    type="submit"
                    disabled={loading || !departure || !arrival || !date}
                    className="h-[50px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 glow-blue transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mencari...
                      </span>
                    ) : (
                      <>
                        Cari Kereta
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Popular Routes Section */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">Rute Populer</h2>
              <p className="text-lg text-muted-foreground">Rute kereta paling banyak dipesan bulan ini</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRoutes.map((route, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6 hover:border-primary/40 transition-all cursor-pointer group hover:scale-105"
                  onClick={() => router.push(`/search?from=${route.from}&to=${route.to}`)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-foreground font-semibold">{route.from}</span>
                    <ArrowRight className="w-4 h-4 text-accent" />
                    <span className="text-foreground font-semibold">{route.to}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-muted-foreground">mulai dari</p>
                      <p className="text-xl font-bold text-primary">{route.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{route.duration}</p>
                      <Clock className="w-4 h-4 text-accent ml-auto" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">Mengapa Memilih Kami</h2>
              <p className="text-lg text-muted-foreground">Rasakan platform pemesanan kereta terbaik</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-8 text-center hover:border-primary/40 transition-all group"
                  >
                    <div className="relative mb-6 mx-auto w-fit">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-colors" />
                      <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-2xl">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">Kata Penumpang Kami</h2>
              <p className="text-lg text-muted-foreground">Dipercaya oleh jutaan penumpang</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Dewi Anggraini',
                  role: 'Pelancong Bisnis',
                  content: 'Pengalaman pemesanan yang sangat lancar. Saya bisa memesan perjalanan Jakarta-Bandung mingguan dalam hitungan detik!',
                  rating: 5,
                },
                {
                  name: 'Ahmad Rizki',
                  role: 'Komuter Rutin',
                  content: 'Aplikasi pemesanan kereta terbaik yang pernah saya gunakan. Fitur pemilihan kursi real-time sangat membantu.',
                  rating: 5,
                },
                {
                  name: 'Siti Nurhaliza',
                  role: 'Pelancong Keluarga',
                  content: 'Pemesanan untuk seluruh keluarga tidak pernah semudah ini. Sangat suka dengan pengalaman premiumnya!',
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-8"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6">{`"${testimonial.content}"`}</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto glass-card rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-foreground mb-6">Siap Memulai Perjalanan Anda?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan jutaan penumpang puas. Pesan perjalanan Anda dengan Visionary Route hari ini.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl glow-blue"
                  onClick={() => router.push('/register')}
                >
                  Mulai Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-primary/30 text-foreground hover:bg-primary/10 font-semibold px-8 py-6 text-lg rounded-xl"
                  onClick={() => router.push('/search')}
                >
                  Jelajahi Rute
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                    <Train className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl gradient-text">Visionary Route</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Platform pemesanan kereta premium untuk penumpang modern.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Tautan Cepat</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Tentang Kami</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Kontak</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Karir</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Dukungan</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Pusat Bantuan</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Syarat Layanan</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Hubungi Kami</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>support@visionaryroute.com</li>
                  <li>+62 21 1234 5678</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 Visionary Route. Hak cipta dilindungi.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
