'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  Train,
  LayoutDashboard,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Train, label: 'Trains', href: '/admin/trains' },
    { icon: MapPin, label: 'Stations', href: '/admin/stations' },
    { icon: Calendar, label: 'Schedules', href: '/admin/schedules' },
    { icon: CreditCard, label: 'Bookings', href: '/admin/bookings' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2.5 rounded-xl glow-blue">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Visionary Route</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? 'bg-primary text-primary-foreground glow-blue'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 lg:hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-primary to-accent p-2.5 rounded-xl">
                    <Train className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-foreground">Admin Panel</h1>
                    <p className="text-xs text-muted-foreground">Visionary Route</p>
                  </div>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <nav className="flex-1 p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            active
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="p-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                <Train className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold gradient-text">Admin</span>
            </Link>
            <div className="w-10" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
