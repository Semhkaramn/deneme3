'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { useConfig } from '@/hooks/use-config';
import { toast } from 'sonner';

export default function SiteConfigTab() {
  const { config, updateSiteConfig } = useConfig();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await updateSiteConfig({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string,
    });

    toast.success('Site konfigürasyonu güncellendi');
  };

  const handleFaviconChange = async (file: string | null) => {
    await updateSiteConfig({
      favicon: file || ''
    });
    toast.success('Favicon güncellendi');
  };

  const handleLogoChange = async (file: string | null) => {
    await updateSiteConfig({
      logo: file || ''
    });
    toast.success('Logo güncellendi');
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Site Konfigürasyonu</CardTitle>
        <CardDescription className="text-gray-300">
          Sitenizin temel bilgilerini düzenleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Site Başlığı</Label>
              <Input
                id="title"
                name="title"
                defaultValue={config.site_config.title}
                placeholder="Sago Casino | Güvenilir Siteler"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-white">Site URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                defaultValue={config.site_config.url}
                placeholder="https://www.sagocasino.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Site Açıklaması</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={config.site_config.description}
              placeholder="En güncel ve güvenilir siteler!"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Site Favicon"
              value={config.site_config.favicon}
              onChange={handleFaviconChange}
              placeholder="Favicon seçin (ICO, PNG)"
              accept="image/*,.ico"
            />

            <FileUpload
              label="Site Logo"
              value={config.site_config.logo}
              onChange={handleLogoChange}
              placeholder="Logo seçin (PNG, SVG)"
              accept="image/*"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Kaydet
          </Button>
        </form>

        <div className="mt-6 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-green-200 font-medium mb-2">Site Konfigürasyon Bilgileri</h4>
              <ul className="text-green-100 text-sm space-y-1">
                <li>• Site başlığı tarayıcı sekmesinde ve SEO'da kullanılır</li>
                <li>• Favicon browser tab'ında görünen küçük icon'dur</li>
                <li>• Logo site header'ında ana logo olarak kullanılır</li>
                <li>• Yüklenen görseller otomatik olarak optimize edilir</li>
                <li>• Değişiklikler anında canlı sitede yansır</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
