'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useConfig } from '@/hooks/use-config';
import { toast } from 'sonner';

export default function CategoriesControlTab() {
  const { config, updateCategoriesControl } = useConfig();

  const handleToggle = (key: keyof typeof config.categories_control, value: boolean) => {
    updateCategoriesControl({ [key]: value });
    toast.success(`${getDisplayName(key)} ${value ? 'etkinleştirildi' : 'devre dışı bırakıldı'}`);
  };

  const getDisplayName = (key: string) => {
    const names: Record<string, string> = {
      show_left_fix: 'Sol Sabit Banner',
      show_right_fix: 'Sağ Sabit Banner',
      show_vip_sites: 'VIP Siteler',
      show_diamond_sites: 'Diamond Siteler',
      show_normal_sites: 'Normal Siteler',
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
      show_left_fix: 'Sayfanın sol tarafında sabit konumda görünen banner',
      show_right_fix: 'Sayfanın sağ tarafında sabit konumda görünen banner',
      show_vip_sites: 'VIP siteler bölümünü göster/gizle',
      show_diamond_sites: 'Diamond siteler bölümünü göster/gizle',
      show_normal_sites: 'Normal siteler bölümünü göster/gizle',
      show_animated_hover: 'Mouse ile hover edilebilen animasyonlu site kartları',
      show_slider_banner: 'Ana sayfa üst kısmındaki dönen banner',
      show_scrolling_banner: 'Sürekli kayan site bannerları',
      show_bottom_banner: 'Sayfanın alt kısmında sabit konumda görünen banner',
      show_popup_banner: 'Sayfa açıldığında beliren popup banner'
    };
    return descriptions[key] || '';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Kategori Kontrolleri</CardTitle>
        <CardDescription className="text-gray-300">
          Hangi bölümlerin sitede görünür olacağını kontrol edin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(config.categories_control).map(([key, value]) => (
            <div key={key} className="space-y-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white font-medium">
                    {getDisplayName(key)}
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
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-200 font-medium mb-2">Önemli Bilgiler</h4>
              <ul className="text-yellow-100 text-sm space-y-1">
                <li>• Devre dışı bırakılan bölümler sitede görünmeyecektir</li>
                <li>• Değişiklikler anında uygulanır</li>
                <li>• VIP, Diamond ve Normal siteler için önce siteler sekmesinden içerik eklemelisiniz</li>
                <li>• Banner bölümleri için görsel içerikler gereklidir</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
