'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useConfig } from '@/hooks/use-config';
import { toast } from 'sonner';
import { CloudConfigStore, isCloudAvailable } from '@/lib/supabase';
import {
  Download,
  Upload,
  Copy,
  Share2,
  Cloud,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function ConfigBackupTab() {
  const { config, importConfig, resetConfig } = useConfig();

  // Check cloud availability on mount
  useEffect(() => {
    setCloudAvailable(isCloudAvailable());
  }, []);
  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [downloadCode, setDownloadCode] = useState('');
  const [isCloudUploading, setIsCloudUploading] = useState(false);
  const [isCloudDownloading, setIsCloudDownloading] = useState(false);
  const [cloudAvailable, setCloudAvailable] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const configJson = await exportConfig();
      setExportData(configJson);
      toast.success('Konfigürasyon dışa aktarıldı');
    } catch (error) {
      toast.error('Dışa aktarma hatası');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!exportData) {
      toast.error('Önce dışa aktar butonuna basın');
      return;
    }

    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sago-casino-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Konfigürasyon dosyası indirildi');
  };

  const handleCopyToClipboard = () => {
    if (!exportData) {
      toast.error('Önce dışa aktar butonuna basın');
      return;
    }

    navigator.clipboard.writeText(exportData).then(() => {
      toast.success('Konfigürasyon panoya kopyalandı');
    }).catch(() => {
      toast.error('Panoya kopyalama hatası');
    });
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error('Lütfen import edilecek konfigürasyonu girin');
      return;
    }

    setIsImporting(true);
    try {
      const success = await importConfig(importData);
      if (success) {
        toast.success('Konfigürasyon başarıyla içe aktarıldı');
        setImportData('');
        // Refresh page to reflect changes
        window.location.reload();
      } else {
        toast.error('Geçersiz konfigürasyon formatı');
      }
    } catch (error) {
      toast.error('İçe aktarma hatası');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
      toast.success('Dosya yüklendi, şimdi içe aktar butonuna basın');
    };
    reader.readAsText(file);
  };

  const handleCloudUpload = async () => {
    if (!cloudAvailable) {
      toast.error('Cloud sync henüz konfigüre edilmemiş');
      return;
    }

    setIsCloudUploading(true);
    try {
      const generatedShareCode = await CloudConfigStore.uploadConfig(config, 'Sago Casino Konfigürasyonu');
      setShareCode(generatedShareCode);
      toast.success(`Konfigürasyon cloud'a yüklendi! Share Code: ${generatedShareCode}`);
    } catch (error) {
      toast.error('Cloud yükleme hatası: ' + (error as Error).message);
    } finally {
      setIsCloudUploading(false);
    }
  };

  const handleCloudDownload = async () => {
    if (!cloudAvailable) {
      toast.error('Cloud sync henüz konfigüre edilmemiş');
      return;
    }

    if (!downloadCode.trim()) {
      toast.error('Lütfen download code girin');
      return;
    }

    setIsCloudDownloading(true);
    try {
      const cloudConfig = await CloudConfigStore.downloadConfig(downloadCode);
      const success = importConfig(JSON.stringify(cloudConfig));
      if (success) {
        toast.success('Konfigürasyon cloud\'dan indirildi ve uygulandı!');
        window.location.reload();
      } else {
        toast.error('Geçersiz konfigürasyon formatı');
      }
    } catch (error) {
      toast.error('Cloud indirme hatası: ' + (error as Error).message);
    } finally {
      setIsCloudDownloading(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Tüm ayarları sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
      await resetConfig();
      toast.success('Tüm ayarlar sıfırlandı');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            Konfigürasyon Dışa Aktarma
          </CardTitle>
          <CardDescription className="text-gray-300">
            Mevcut ayarlarınızı başka tarayıcı veya cihazlarda kullanmak için dışa aktarın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Dışa Aktar
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              disabled={!exportData}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Dosya İndir
            </Button>
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              disabled={!exportData}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Panoya Kopyala
            </Button>
          </div>

          {exportData && (
            <div className="space-y-2">
              <Label className="text-white">Dışa Aktarılan Konfigürasyon:</Label>
              <Textarea
                value={exportData}
                readOnly
                className="bg-slate-700 border-slate-600 text-white font-mono text-xs h-40"
                placeholder="Dışa aktarılan konfigürasyon burada görünecek..."
              />
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                Bu kodu başka tarayıcıda içe aktarabilirsiniz
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Konfigürasyon İçe Aktarma
          </CardTitle>
          <CardDescription className="text-gray-300">
            Başka bir yerden aldığınız konfigürasyonu içe aktarın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Dosyadan İçe Aktar:</Label>
            <Input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Veya Konfigürasyon Kodunu Buraya Yapıştırın:</Label>
            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white font-mono text-xs h-40"
              placeholder="Konfigürasyon JSON kodunu buraya yapıştırın..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={isImporting || !importData.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isImporting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              İçe Aktar
            </Button>
            <Button
              onClick={() => setImportData('')}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Temizle
            </Button>
          </div>

          <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div className="text-yellow-200 text-sm">
                <p className="font-medium mb-1">Dikkat:</p>
                <p>İçe aktarma mevcut tüm ayarlarınızın üzerine yazacak. İşlem geri alınamaz!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cloud Sync Section */}
      <Card className={`bg-slate-800/50 border-slate-700 ${!cloudAvailable ? 'opacity-60' : ''}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Cloud Sync
            {cloudAvailable ? (
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">AKTİF</span>
            ) : (
              <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">PASİF</span>
            )}
          </CardTitle>
          <CardDescription className="text-gray-300">
            Ayarlarınızı bulutta saklayın ve share code ile paylaşın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">📤 Cloud'a Yükle</h4>
            <div className="flex gap-2">
              <Button
                onClick={handleCloudUpload}
                disabled={isCloudUploading || !cloudAvailable}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isCloudUploading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
                Cloud'a Yükle
              </Button>
            </div>

            {shareCode && (
              <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 font-medium">✅ Başarıyla yüklendi!</p>
                    <p className="text-green-100 text-sm">Share Code: <code className="bg-green-800 px-2 py-1 rounded">{shareCode}</code></p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(shareCode)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Download Section */}
          <div className="space-y-4 border-t border-slate-600 pt-4">
            <h4 className="text-white font-medium">📥 Cloud'dan İndir</h4>
            <div className="space-y-2">
              <Label className="text-white">Share Code:</Label>
              <Input
                value={downloadCode}
                onChange={(e) => setDownloadCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="bg-slate-700 border-slate-600 text-white font-mono"
                disabled={!cloudAvailable}
                maxLength={6}
              />
            </div>
            <Button
              onClick={handleCloudDownload}
              disabled={isCloudDownloading || !cloudAvailable || !downloadCode.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCloudDownloading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Cloud className="w-4 h-4 mr-2" />}
              Cloud'dan İndir
            </Button>
          </div>

          {/* Status */}
          <div className={`p-3 border rounded-lg ${cloudAvailable
            ? 'bg-green-900/20 border-green-600/30'
            : 'bg-orange-900/20 border-orange-600/30'
          }`}>
            {cloudAvailable ? (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <p className="text-green-200 font-medium">Cloud Sync Aktif</p>
                  <p className="text-green-100 text-sm">Supabase entegrasyonu çalışıyor. Konfigürasyonlarınızı güvenle paylaşabilirsiniz.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-orange-200 font-medium">Cloud Sync Pasif</p>
                  <p className="text-orange-100 text-sm">Supabase konfigürasyonu eksik. .env.local dosyasında SUPABASE_URL ve SUPABASE_ANON_KEY ayarlayın.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reset Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Ayarları Sıfırla
          </CardTitle>
          <CardDescription className="text-gray-300">
            Tüm ayarları varsayılan değerlere döndürün
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                <div className="text-red-200 text-sm">
                  <p className="font-medium mb-1">Dikkat!</p>
                  <p>Bu işlem tüm ayarlarınızı silecek ve varsayılan değerlere döndürecek. Bu işlem geri alınamaz!</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleReset}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-700/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tüm Ayarları Sıfırla
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Kullanım Kılavuzu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <h4 className="text-white font-medium mb-2">🔄 Tarayıcılar Arası Ayar Aktarımı:</h4>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Mevcut tarayıcıda "Dışa Aktar" butonuna basın</li>
                <li>"Panoya Kopyala" veya "Dosya İndir" ile konfigürasyonu alın</li>
                <li>Diğer tarayıcı/cihazda admin panelini açın</li>
                <li>Bu sekmeye gelip konfigürasyonu "İçe Aktar" bölümüne yapıştırın</li>
                <li>"İçe Aktar" butonuna basın</li>
              </ol>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">💾 Yedekleme Önerileri:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Önemli değişikliklerden önce konfigürasyonu dışa aktarın</li>
                <li>JSON dosyasını güvenli bir yerde saklayın</li>
                <li>Farklı cihazlarda aynı ayarları kullanmak için export/import kullanın</li>
                <li>Cloud sync aktifse share code ile hızlıca paylaşım yapabilirsiniz</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">☁️ Cloud Sync Nasıl Çalışır:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Konfigürasyonunuzu cloud'a yükleyin, 6 haneli share code alın</li>
                <li>Share code'u başka cihazda girerek aynı ayarları indirin</li>
                <li>Share code'lar güvenli ve tek kullanımlık değildir</li>
                <li>Supabase database güvenli şekilde şifrelenmiş olarak saklar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
