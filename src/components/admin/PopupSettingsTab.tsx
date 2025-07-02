'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConfig } from '@/hooks/use-config';
import { toast } from 'sonner';
import { Bell, Timer, MessageSquare, Save } from 'lucide-react';

export default function PopupSettingsTab() {
  const { config, updatePopupSettings } = useConfig();

  // Local state for real-time preview
  const [previewData, setPreviewData] = useState({
    enabled: config.popup_settings.enabled,
    delay: config.popup_settings.delay,
    title: config.popup_settings.title,
    main_text: config.popup_settings.main_text,
    sub_text: config.popup_settings.sub_text,
    site_ref: config.popup_settings.site_ref,
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setPreviewData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await updatePopupSettings(previewData);
    toast.success('Popup ayarları kaydedildi');
  };

  const handleToggle = (enabled: boolean) => {
    setPreviewData(prev => ({ ...prev, enabled }));
  };

  const selectedSite = config.sites.find(site => site.site === previewData.site_ref);

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
              checked={previewData.enabled}
              onCheckedChange={handleToggle}
            />
          </div>

          {/* Settings - Only show if enabled */}
          {previewData.enabled && (
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
                  value={previewData.delay}
                  onChange={(e) => handleInputChange('delay', Number(e.target.value))}
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
                  value={previewData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
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
                  value={previewData.main_text}
                  onChange={(e) => handleInputChange('main_text', e.target.value)}
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
                  value={previewData.sub_text}
                  onChange={(e) => handleInputChange('sub_text', e.target.value)}
                  placeholder="HERGÜN YÜZLERCE BEDAVA KOD"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Site Reference */}
              <div className="space-y-2">
                <Label htmlFor="site_ref" className="text-white">Site Referansı</Label>
                <Select
                  value={previewData.site_ref}
                  onValueChange={(value) => handleInputChange('site_ref', value)}
                >
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

              {/* Real-time Preview */}
              <div className="p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Canlı Popup Önizlemesi
                </h4>
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 max-w-sm mx-auto text-center">
                  <h3 className="text-yellow-400 text-sm font-bold mb-2">
                    {previewData.title || 'Popup Başlığı'}
                  </h3>
                  <div className="w-16 h-16 bg-slate-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    {selectedSite && selectedSite.sitepic ? (
                      <img
                        src={selectedSite.sitepic}
                        alt={selectedSite.site}
                        className="w-12 h-12 object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Bell className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h1 className="text-white font-bold text-lg mb-2">
                    {previewData.main_text || 'Ana Metin'}
                  </h1>
                  <small className="text-gray-400 block mb-3">
                    {previewData.sub_text || 'Alt Metin'}
                  </small>
                  <div
                    className="text-white py-2 px-4 rounded-full text-sm font-bold cursor-pointer"
                    style={{ backgroundColor: selectedSite?.color || '#3B82F6' }}
                  >
                    {selectedSite?.button_text || 'GİRİŞ YAP'}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {previewData.delay / 1000} saniye sonra görünecek
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

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Popup Ayarlarını Kaydet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
