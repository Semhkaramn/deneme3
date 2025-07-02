'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useConfig } from '@/hooks/use-config';
import { toast } from 'sonner';
import { Save, ToggleLeft } from 'lucide-react';

export default function CategoriesControlTab() {
  const { config, updateCategoriesControl } = useConfig();

  const handleToggle = async (key: keyof typeof config.categories_control, value: boolean) => {
    await updateCategoriesControl({ [key]: value });
    toast.success(`${getDisplayName(key)} ${value ? 'etkinleştirildi' : 'devre dışı bırakıldı'}`);
  };

  const getDisplayName = (key: string) => {
    const names: Record<string, string> = {
      show_left_fix: 'Sol Sabit Banner',
      show_right_fix: 'Sağ Sabit Banner',
      show_vip_sites: 'VIP Siteler',
      show_animated_hover: 'Animasyonlu Hover Siteler',
      show_slider_banner: 'Slider Banner',
      show_scrolling_banner: 'Kayan Banner',
      show_bottom_banner: 'Alt Banner',
      show_popup_banner: 'Popup Banner'
    };
    return names[key] || key;
  };

  const getDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      show_left_fix: 'Sayfanın sol tarafında sabit konumda görünen banner (en fazla 1 site)',
      show_right_fix: 'Sayfanın sağ tarafında sabit konumda görünen banner (en fazla 1 site)',
      show_vip_sites: 'VIP siteler bölümünü göster/gizle',
      show_animated_hover: 'Mouse ile hover edilebilen animasyonlu site kartları (en fazla 4 site)',
      show_slider_banner: 'Ana sayfa üst kısmındaki dönen banner',
      show_scrolling_banner: 'Sürekli kayan site bannerları',
      show_bottom_banner: 'Sayfanın alt kısmında sürekli değişen banner',
      show_popup_banner: 'Sayfa açıldığında beliren popup banner'
    };
    return descriptions[key] || '';
  };

  const getIcon = (key: string) => {
    const icons: Record<string, string> = {
      show_left_fix: '📍',
      show_right_fix: '📌',
      show_vip_sites: '👑',
      show_animated_hover: '✨',
      show_slider_banner: '🎠',
      show_scrolling_banner: '🌊',
      show_bottom_banner: '📱',
      show_popup_banner: '🔔'
    };
    return icons[key] || '🎯';
  };

  const isLimitedCategory = (key: string) => {
    return ['show_left_fix', 'show_right_fix', 'show_animated_hover'].includes(key);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ToggleLeft className="w-5 h-5" />
          Kategori Kontrolleri
        </CardTitle>
        <CardDescription className="text-gray-300">
          Hangi bölümlerin sitede görünür olacağını kontrol edin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(config.categories_control).map(([key, value]) => (
            <div
              key={key}
              className={`space-y-3 p-4 rounded-lg border transition-all duration-200 ${
                value
                  ? 'bg-green-900/20 border-green-600/30'
                  : 'bg-slate-700/30 border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1">
                  <Label className="text-white font-medium flex items-center gap-2">
                    <span className="text-lg">{getIcon(key)}</span>
                    {getDisplayName(key)}
                    {isLimitedCategory(key) && (
                      <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">
                        LİMİTLİ
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-gray-400">
                    {getDescription(key)}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handleToggle(key as keyof typeof config.categories_control, checked)}
                />
              </div>

              {value && (
                <div className="text-xs text-green-300 bg-green-900/20 p-2 rounded border border-green-600/20">
                  ✅ Bu bölüm sitede gösterilecek
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-200 font-medium mb-2">Site Limitleri</h4>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• <strong>Sol/Sağ Sabit Banner:</strong> Her birine en fazla 1 site eklenebilir</li>
                <li>• <strong>Animasyonlu Hover:</strong> En fazla 4 site eklenebilir</li>
                <li>• <strong>Diğer Kategoriler:</strong> Sınırsız site eklenebilir</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-200 font-medium mb-2">Önemli Bilgiler</h4>
              <ul className="text-yellow-100 text-sm space-y-1">
                <li>• Devre dışı bırakılan bölümler sitede görünmeyecektir</li>
                <li>• Değişiklikler anında uygulanır</li>
                <li>• Siteler sekmesinden içerik ekleyebilir ve düzenleyebilirsiniz</li>
                <li>• Banner bölümleri için görsel içerikler gereklidir</li>
                <li>• Mobil cihazlarda otomatik responsive tasarım uygulanır</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
