'use client';

import { useState } from 'react';
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
  RotateCcw,
  Palette,
  LogOut
} from 'lucide-react';

import { useConfig } from '@/hooks/use-config';
import AdminAuthWrapper from '@/components/AdminAuthWrapper';
import SiteConfigTab from '@/components/admin/SiteConfigTab';
import CategoriesControlTab from '@/components/admin/CategoriesControlTab';
import SocialLinksTab from '@/components/admin/SocialLinksTab';
import HeaderLinksTab from '@/components/admin/HeaderLinksTab';
import PopupSettingsTab from '@/components/admin/PopupSettingsTab';
import SitesTab from '@/components/admin/SitesTab';
import ThemeTab from '@/components/admin/ThemeTab';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function AdminPanel() {
  const { resetConfig } = useConfig();
  const [activeTab, setActiveTab] = useState('site-config');
  const router = useRouter();

  const handleReset = () => {
    if (confirm('Tüm ayarlar sıfırlanacak. Emin misiniz?')) {
      resetConfig();
      toast.success('Konfigürasyon sıfırlandı');
    }
  };

  const handleLogout = () => {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      localStorage.removeItem('admin-authenticated');
      toast.success('Çıkış yapıldı');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Sago Casino Admin Panel
              </h1>
              <p className="text-gray-300">
                🚀 Real-time güncelleme - Değişiklikler anında canlı sitede yansır
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => window.open('/', '_blank')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Canlı Siteyi Görüntüle
              </Button>
              <Button onClick={handleReset} variant="outline" className="bg-red-600 hover:bg-red-700 text-white border-red-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Sıfırla
              </Button>
              <Button onClick={handleLogout} variant="outline" className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600">
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-slate-800/50 backdrop-blur">
            <TabsTrigger value="site-config" className="flex items-center gap-2 data-[state=active]:bg-slate-700">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Site</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2 data-[state=active]:bg-slate-700">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Tema</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-slate-700">
              <ToggleLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kategoriler</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2 data-[state=active]:bg-slate-700">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Sosyal</span>
            </TabsTrigger>
            <TabsTrigger value="header-links" className="flex items-center gap-2 data-[state=active]:bg-slate-700">
              <Link className="w-4 h-4" />
              <span className="hidden sm:inline">Header</span>
            </TabsTrigger>
            <TabsTrigger value="popup" className="flex items-center gap-2 data-[state=active]:bg-slate-700">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Popup</span>
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center gap-2 data-[state=active]:bg-slate-700">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Siteler</span>
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
