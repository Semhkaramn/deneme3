'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Palette, RotateCcw, Save } from 'lucide-react';
import { useConfig } from '@/hooks/use-config';
import type { ThemeColors } from '@/lib/types';

export default function ThemeTab() {
  const { config, updateThemeColors } = useConfig();

  // Local state for theme colors (no auto-save)
  const [colors, setColors] = useState<ThemeColors>(config.theme_colors);

  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'admin123'
  });

  // Load admin credentials from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('admin-username');
    const savedPassword = localStorage.getItem('admin-password');
    if (savedUsername) setCredentials(prev => ({ ...prev, username: savedUsername }));
    if (savedPassword) setCredentials(prev => ({ ...prev, password: savedPassword }));
  }, []);

  // Update local colors when config changes
  useEffect(() => {
    setColors(config.theme_colors);
  }, [config.theme_colors]);

  // Apply colors to CSS variables (live preview)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', colors.bg);
    root.style.setProperty('--menu', colors.menu);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--card2', colors.card2);
  }, [colors]);

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }));
  };

  const handleThemeSave = async () => {
    await updateThemeColors(colors);
    toast.success('Tema renkleri kaydedildi');
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin-username', credentials.username);
    localStorage.setItem('admin-password', credentials.password);
    toast.success('Giriş bilgileri güncellendi');
  };

  const resetToDefaults = async () => {
    if (confirm('Tema renkleri varsayılan değerlere sıfırlanacak. Emin misiniz?')) {
      const defaultColors: ThemeColors = {
        bg: '#0E184E',
        menu: '#172261',
        card: '#162160',
        card2: '#111C4F'
      };
      setColors(defaultColors);
      await updateThemeColors(defaultColors);
      toast.success('Tema renkleri sıfırlandı');
    }
  };

  const getColorName = (key: keyof ThemeColors) => {
    const names = {
      bg: 'Arka Plan',
      menu: 'Menü',
      card: 'Kart',
      card2: 'İkinci Kart'
    };
    return names[key];
  };

  const hasChanges = () => {
    return JSON.stringify(colors) !== JSON.stringify(config.theme_colors);
  };

  return (
    <div className="space-y-6">

      {/* Theme Colors */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Tema Renkleri
          </CardTitle>
          <CardDescription className="text-gray-300">
            Site temasının ana renklerini düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="text-white capitalize">
                  {getColorName(key as keyof ThemeColors)}
                </Label>
                <div className="flex gap-3 items-center">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                    className="w-16 h-12 rounded-lg border-slate-600 bg-slate-700 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white font-mono"
                    placeholder="#000000"
                  />
                </div>
                <div
                  className="w-full h-8 rounded-lg border border-slate-600"
                  style={{ backgroundColor: value }}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleThemeSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!hasChanges()}
            >
              <Save className="w-4 h-4 mr-2" />
              Tema Renklerini Kaydet
            </Button>
            <Button
              onClick={resetToDefaults}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Varsayılana Sıfırla
            </Button>
          </div>

          {hasChanges() && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <p className="text-yellow-200 text-sm">
                ⚠️ Değişiklikleri kaydetmeyi unutmayın!
              </p>
            </div>
          )}

          {/* Live Preview */}
          <div className="mt-6 p-4 rounded-lg border border-slate-600" style={{ backgroundColor: colors.bg }}>
            <h4 className="text-white font-medium mb-3">Canlı Önizleme</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.menu }}>
                <span className="text-white text-sm">Menü Alanı</span>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.card }}>
                <span className="text-white text-sm">Kart Alanı</span>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.card2 }}>
                <span className="text-white text-sm">İkinci Kart Alanı</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Credentials */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🔐 Admin Giriş Bilgileri
          </CardTitle>
          <CardDescription className="text-gray-300">
            Admin paneli giriş kullanıcı adı ve şifresini değiştirin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Kullanıcı Adı</Label>
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Şifre</Label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Giriş Bilgilerini Kaydet
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-purple-900/20 border border-purple-600/30 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-purple-500 rounded-full flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-purple-200 font-medium mb-2">Tema Bilgileri</h4>
            <ul className="text-purple-100 text-sm space-y-1">
              <li>• Renk değişiklikleri canlı önizlemede görülür</li>
              <li>• Kaydet butonuna basana kadar değişiklikler kalıcı olmaz</li>
              <li>• CSS değişkenleri --bg, --menu, --card, --card2 güncellenir</li>
              <li>• Giriş bilgileri değişikliği anında etkinleşir</li>
              <li>• Eski oturumlar otomatik olarak sonlandırılır</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
