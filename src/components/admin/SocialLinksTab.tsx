'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConfig } from '@/hooks/use-config';
import { toast } from 'sonner';
import { MessageCircle, Instagram, Youtube, Send } from 'lucide-react';

export default function SocialLinksTab() {
  const { config, updateSocialLinks } = useConfig();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateSocialLinks({
      telegram_main: formData.get('telegram_main') as string,
      telegram_announcement: formData.get('telegram_announcement') as string,
      telegram_chat: formData.get('telegram_chat') as string,
      instagram: formData.get('instagram') as string,
      youtube: formData.get('youtube') as string,
    });

    toast.success('Sosyal medya linkleri güncellendi');
  };

  const isLinkActive = (link: string) => {
    return link && link.trim() !== '';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Sosyal Medya Linkleri
        </CardTitle>
        <CardDescription className="text-gray-300">
          Sosyal medya hesaplarınızın linklerini düzenleyin. Boş bırakılan linkler sitede görünmeyecektir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">

            {/* Telegram Ana */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <Label htmlFor="telegram_main" className="text-white">
                  Telegram Ana Kanal
                </Label>
                {isLinkActive(config.social_links.telegram_main) && (
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                    Aktif
                  </Badge>
                )}
              </div>
              <Input
                id="telegram_main"
                name="telegram_main"
                type="url"
                defaultValue={config.social_links.telegram_main}
                placeholder="https://t.me/sagoslot"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400">
                Header'da ana Telegram butonu olarak görünür
              </p>
            </div>

            {/* Telegram Duyuru */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <Label htmlFor="telegram_announcement" className="text-white">
                  Telegram Duyuru Kanalı
                </Label>
                {isLinkActive(config.social_links.telegram_announcement) && (
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                    Aktif
                  </Badge>
                )}
              </div>
              <Input
                id="telegram_announcement"
                name="telegram_announcement"
                type="url"
                defaultValue={config.social_links.telegram_announcement}
                placeholder="https://t.me/sagoduyuruetkinlik"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400">
                Header linkleri içinde "DUYURU KANALIMIZ" olarak görünür
              </p>
            </div>

            {/* Telegram Sohbet */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <Label htmlFor="telegram_chat" className="text-white">
                  Telegram Sohbet Kanalı
                </Label>
                {isLinkActive(config.social_links.telegram_chat) && (
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                    Aktif
                  </Badge>
                )}
              </div>
              <Input
                id="telegram_chat"
                name="telegram_chat"
                type="url"
                defaultValue={config.social_links.telegram_chat}
                placeholder="https://t.me/CSSAGO"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400">
                Header linkleri içinde "SOHBET KANALIMIZ" olarak görünür
              </p>
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400" />
                <Label htmlFor="instagram" className="text-white">
                  Instagram
                </Label>
                {isLinkActive(config.social_links.instagram) && (
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                    Aktif
                  </Badge>
                )}
              </div>
              <Input
                id="instagram"
                name="instagram"
                type="url"
                defaultValue={config.social_links.instagram}
                placeholder="https://instagram.com/sagoslot"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400">
                Header'da Instagram butonu olarak görünür
              </p>
            </div>

            {/* YouTube */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-400" />
                <Label htmlFor="youtube" className="text-white">
                  YouTube
                </Label>
                {isLinkActive(config.social_links.youtube) && (
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                    Aktif
                  </Badge>
                )}
              </div>
              <Input
                id="youtube"
                name="youtube"
                type="url"
                defaultValue={config.social_links.youtube}
                placeholder="https://youtube.com/@sagocasino"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400">
                Gelecekte kullanılmak üzere rezerve edilmiştir
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-200 font-medium mb-2">Önemli Bilgiler</h4>
                <ul className="text-blue-100 text-sm space-y-1">
                  <li>• Boş bırakılan linkler sitede görünmeyecektir</li>
                  <li>• Telegram linkleri header bölümünde ayrı butonlar olarak görünür</li>
                  <li>• Instagram ve YouTube linkleri sosyal medya butonları olarak görünür</li>
                  <li>• Tüm linkler yeni sekmede açılır</li>
                </ul>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Kaydet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
