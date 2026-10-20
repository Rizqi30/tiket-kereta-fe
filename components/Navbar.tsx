'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Train, User, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-lg blur-md group-hover:bg-primary/50 transition-colors" />
              <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                <Train className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="font-bold text-xl gradient-text">Visionary Route</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Beranda
            </Link>
            <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Cari Kereta
            </Link>
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{user?.name}</span>
                </div>
                <Link href={user?.role === 'PENUMPANG' ? '/dashboard' : '/admin'}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    {user?.role === 'PENUMPANG' ? 'Dasbor' : 'Panel Admin'}
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary/10">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-blue">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 space-y-2 border-t border-primary/20 pt-4"
            >
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              >
                Cari Kereta
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </div>
                  <Link
                    href={user?.role === 'PENUMPANG' ? '/dashboard' : '/admin'}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
                  >
                    {user?.role === 'PENUMPANG' ? 'Dasbor' : 'Panel Admin'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
