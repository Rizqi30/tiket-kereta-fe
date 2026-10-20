'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, User, Mail, Phone, Lock, UserPlus, Train, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      const { token, user } = response.data;
      login(user, token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Pemesanan tiket instan',
    'Pemilihan kursi real-time',
    'Diskon eksklusif member',
    'Layanan pelanggan 24/7',
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl glow-blue">
              <Train className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl gradient-text">Visionary Route</span>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-2xl p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Buat Akun</h1>
              <p className="text-muted-foreground">Bergabunglah dengan ribuan penumpang puas</p>
            </div>

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

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama Lengkap"
                    required
                    className="pl-12 h-12 bg-input/50 border-border rounded-xl focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@anda.com"
                    required
                    className="pl-12 h-12 bg-input/50 border-border rounded-xl focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62-812-3456-7890"
                    required
                    className="pl-12 h-12 bg-input/50 border-border rounded-xl focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="pl-12 h-12 bg-input/50 border-border rounded-xl focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Konfirmasi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="pl-12 h-12 bg-input/50 border-border rounded-xl focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <input type="checkbox" required className="rounded border-border mt-0.5" />
                <span>
                  Saya setuju dengan{' '}
                  <a href="#" className="text-primary hover:underline">Syarat Layanan</a>
                  {' '}dan{' '}
                  <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a>
                </span>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-blue transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Membuat akun...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Buat Akun
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/hero/hero-train.jpg"
          alt="Pengalaman Kereta"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Floating Content */}
        <div className="absolute bottom-20 left-10 right-10 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Mulai <span className="gradient-text">Perjalanan Premium</span> Anda
            </h2>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <CheckCircle className="w-5 h-5 text-accent" />
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
