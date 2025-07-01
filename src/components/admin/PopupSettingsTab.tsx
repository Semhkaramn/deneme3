'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConfig } from '@/hooks/use-config';
import { toast } from 'sonner';
import { Bell, Timer, MessageSquare } from 'lucide-react';

export default function PopupSettingsTab() {
  const { config, updatePopupSettings } = useConfig();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updatePopupSettings({
      enabled: formData.get('enabled') === 'on',
      delay: Number.parseInt(formData.get('delay') as string) || 3000,
      title: formData.get('title') as string,
      main_text: formData.get('main_text') as string,
      sub_text: formData.get('sub_text') as string,
      site_ref: formData.get('site_ref') as string,
    });

    toast.success('Popup ayarları güncellendi');
  };

  const handleToggle = (enabled: boolean) => {
    updatePopupSettings({ enabled });
    toast.success(`Popup ${enabled ? 'etkinleştirildi' : 'devre dışı bırakıldı'}`);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Popup Banner Ayarları
        </CardTitle>
        <CardDescription className="text-gray-300">
          Sayfa açıldığında görünecek popup banner'ını yapılandırın
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="space-y-1">
              <Label className="text-white font-medium">Popup Banner'ı Etkinleştir</Label>
              <p className="text-sm text-gray-400">
                Popup'ı açıp kapatabilirsiniz
              </p>
            </div>
            <Switch
              checked={config.popup_settings.enabled}
              onCheckedChange={handleToggle}
            />
          </div>

          {/* Settings - Only show if enabled */}
          {config.popup_settings.enabled && (
            <>
              {/* Delay Setting */}
              <div className="space-y-2">
                <Label htmlFor="delay" className="text-white flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Gecikme Süresi (milisaniye)
                </Label>
                <Input
                  id="delay"
                  name="delay"
                  type="number"
                  min="1000"
                  max="10000"
                  step="500"
                  defaultValue={config.popup_settings.delay}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-400">
                  Sayfa açıldıktan kaç milisaniye sonra popup görünecek (1000 = 1 saniye)
                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Popup Başlığı</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={config.popup_settings.title}
                  placeholder="TELEGRAM KOD KANALI"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Main Text */}
              <div className="space-y-2">
                <Label htmlFor="main_text" className="text-white">Ana Metin</Label>
                <Textarea
                  id="main_text"
                  name="main_text"
                  defaultValue={config.popup_settings.main_text}
                  placeholder="TELEGRAM KOD KANALIMIZA KATILIN KAZANMAYA BAŞLAYIN!"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  rows={3}
                />
              </div>

              {/* Sub Text */}
              <div className="space-y-2">
                <Label htmlFor="sub_text" className="text-white">Alt Metin</Label>
                <Input
                  id="sub_text"
                  name="sub_text"
                  defaultValue={config.popup_settings.sub_text}
                  placeholder="HERGÜN YÜZLERCE BEDAVA KOD"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Site Reference */}
              <div className="space-y-2">
                <Label htmlFor="site_ref" className="text-white">Site Referansı</Label>
                <Select name="site_ref" defaultValue={config.popup_settings.site_ref}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Popup'ta gösterilecek siteyi seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {config.sites.length === 0 ? (
                      <SelectItem value="" className="text-gray-400">
                        Önce siteler sekmesinden site ekleyin
                      </SelectItem>
                    ) : (
                      config.sites.map((site) => (
                        <SelectItem key={site.id} value={site.site} className="text-white">
                          {site.site} - {site.desc[0]}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">
                  Popup'ta gösterilecek sitenin logosu ve linki kullanılacak
                </p>
              </div>

              {/* Preview */}
              <div className="p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Popup Önizlemesi
                </h4>
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 max-w-sm mx-auto text-center">
                  <h3 className="text-yellow-400 text-sm font-bold mb-2">
                    {config.popup_settings.title || 'Popup Başlığı'}
                  </h3>
                  <div className="w-16 h-16 bg-slate-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h1 className="text-white font-bold text-lg mb-2">
                    {config.popup_settings.main_text || 'Ana Metin'}
                  </h1>
                  <small className="text-gray-400 block mb-3">
                    {config.popup_settings.sub_text || 'Alt Metin'}
                  </small>
                  <div className="bg-blue-600 text-white py-2 px-4 rounded-full text-sm font-bold">
                    GİRİŞ YAP
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Gerçek popup'ta seçilen sitenin logosu görünecek
                </p>
              </div>
            </>
          )}

          <div className="mt-6 p-4 bg-orange-900/20 border border-orange-600/30 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-orange-200 font-medium mb-2">Popup Kullanım Bilgileri</h4>
                <ul className="text-orange-100 text-sm space-y-1">
                  <li>• Popup, sayfa açıldıktan belirlenen süre sonra görünür</li>
                  <li>• Kullanıcılar popup'ı kapatabilir</li>
                  <li>• Site referansı olarak seçilen sitenin logosu ve linki kullanılır</li>
                  <li>• Popup, sayfanın ortasında modal olarak açılır</li>
                  <li>• Mobil cihazlarda otomatik olarak responsive tasarım kullanılır</li>
                </ul>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Popup Ayarlarını Kaydet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
