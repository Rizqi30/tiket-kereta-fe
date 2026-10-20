'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Mail, Lock, LogIn, Train, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login(email, password);
      const { token, user } = response.data;
      login(user, token);
      router.push(user.role === 'PENUMPANG' ? '/dashboard' : '/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal masuk. Silakan periksa kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/trains/train-card.jpg"
          alt="Interior Kereta"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Floating Content */}
        <div className="absolute bottom-20 left-10 right-10 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Selamat Datang Kembali di <span className="gradient-text">Visionary Route</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Lanjutkan perjalanan Anda dengan pengalaman pemesanan kereta premium
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Masuk</h1>
              <p className="text-muted-foreground">Masukkan kredensial Anda untuk mengakses akun</p>
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

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@anda.com"
                    required
                    className="pl-12 h-12 bg-input/50 border-border rounded-xl focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-12 h-12 bg-input/50 border-border rounded-xl focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  Ingat saya
                </label>
                <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Lupa kata sandi?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-blue transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Masuk
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Belum punya akun?{' '}
                <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-semibold text-foreground">Demo:</span> Gunakan email/kata sandi apa pun untuk mencoba
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
