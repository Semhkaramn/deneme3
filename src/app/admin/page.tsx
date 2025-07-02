'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import {
  Settings,
  Globe,
  ToggleLeft,
  MessageSquare,
  Link,
  Bell,
  Monitor,
  Palette,
  LogOut,
  Save
} from 'lucide-react';

import { useConfig } from '@/hooks/use-config';
import { GlobalConfigStore } from '@/lib/global-config-store';
import { isCloudAvailable } from '@/lib/supabase';
import AdminAuthWrapper from '@/components/AdminAuthWrapper';
import SiteConfigTab from '@/components/admin/SiteConfigTab';
import CategoriesControlTab from '@/components/admin/CategoriesControlTab';
import SocialLinksTab from '@/components/admin/SocialLinksTab';
import HeaderLinksTab from '@/components/admin/HeaderLinksTab';
import PopupSettingsTab from '@/components/admin/PopupSettingsTab';
import SitesTab from '@/components/admin/SitesTab';
import ThemeTab from '@/components/admin/ThemeTab';
import ConfigBackupTab from '@/components/admin/ConfigBackupTab';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function AdminPanel() {
  const { config, isLoading } = useConfig();
  const [activeTab, setActiveTab] = useState('site-config');
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [cloudStatus, setCloudStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const router = useRouter();

  // Check cloud status on mount
  useEffect(() => {
    const checkCloud = async () => {
      if (!isCloudAvailable()) {
        setCloudStatus('offline');
        return;
      }

      try {
        const isConnected = await GlobalConfigStore.testCloudConnection();
        setCloudStatus(isConnected ? 'connected' : 'offline');
      } catch {
        setCloudStatus('offline');
      }
    };

    checkCloud();
  }, []);

  // Auto-logout functionality
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      const timeoutMs = config.admin_settings.session_timeout;

      if (inactiveTime > timeoutMs) {
        localStorage.removeItem('admin-authenticated');
        toast.error('Oturum zaman aşımına uğradı. Tekrar giriş yapın.');
        router.push('/login');
      }
    };

    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    // Check every minute
    const inactivityTimer = setInterval(checkInactivity, 60000);

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      clearInterval(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [lastActivity, config.admin_settings.session_timeout, router]);

  const handleLogout = () => {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      localStorage.removeItem('admin-authenticated');
      toast.success('Çıkış yapıldı');
      router.push('/login');
    }
  };

  const remainingTime = () => {
    const elapsed = Date.now() - lastActivity;
    const remaining = config.admin_settings.session_timeout - elapsed;
    const minutes = Math.floor(remaining / 60000);
    return Math.max(0, minutes);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Konfigürasyon yükleniyor...</p>
          <p className="text-gray-400 text-sm">Cloud sync kontrol ediliyor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Sago Casino Admin Panel
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-300">
                  🚀 Real-time güncelleme - Değişiklikler anında canlı sitede yansır
                </p>
                <div className="flex items-center gap-2">
                  {cloudStatus === 'checking' && (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-yellow-400 text-sm">Cloud kontrol ediliyor...</span>
                    </>
                  )}
                  {cloudStatus === 'connected' && (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-sm">Global Sync Aktif</span>
                    </>
                  )}
                  {cloudStatus === 'offline' && (
                    <>
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-400 text-sm">Sadece Lokal</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-right mr-4">
                <p className="text-xs text-gray-400">Oturum süresi</p>
                <p className="text-sm text-white font-mono">
                  {remainingTime()} dakika kaldı
                </p>
              </div>
              <Button
                onClick={() => window.open('/preview', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Site Önizlemesi
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-800/50 backdrop-blur">
            <TabsTrigger value="site-config" className="flex items-center gap-2 data-[state=active]:bg-slate-700 text-white">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Site</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2 data-[state=active]:bg-slate-700 text-white">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Tema</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-slate-700 text-white">
              <ToggleLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kategoriler</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2 data-[state=active]:bg-slate-700 text-white">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Sosyal</span>
            </TabsTrigger>
            <TabsTrigger value="header-links" className="flex items-center gap-2 data-[state=active]:bg-slate-700 text-white">
              <Link className="w-4 h-4" />
              <span className="hidden sm:inline">Header</span>
            </TabsTrigger>
            <TabsTrigger value="popup" className="flex items-center gap-2 data-[state=active]:bg-slate-700 text-white">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Popup</span>
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center gap-2 data-[state=active]:bg-slate-700 text-white">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Siteler</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2 data-[state=active]:bg-slate-700 text-white">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Yedek</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-slate-800/30 backdrop-blur rounded-lg border border-slate-700">
            <TabsContent value="site-config" className="p-6">
              <SiteConfigTab />
            </TabsContent>

            <TabsContent value="theme" className="p-6">
              <ThemeTab />
            </TabsContent>

            <TabsContent value="categories" className="p-6">
              <CategoriesControlTab />
            </TabsContent>

            <TabsContent value="social" className="p-6">
              <SocialLinksTab />
            </TabsContent>

            <TabsContent value="header-links" className="p-6">
              <HeaderLinksTab />
            </TabsContent>

            <TabsContent value="popup" className="p-6">
              <PopupSettingsTab />
            </TabsContent>

            <TabsContent value="sites" className="p-6">
              <SitesTab />
            </TabsContent>

            <TabsContent value="backup" className="p-6">
              <ConfigBackupTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthWrapper>
      <AdminPanel />
    </AdminAuthWrapper>
  );
}
