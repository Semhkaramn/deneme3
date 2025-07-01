'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/ui/file-upload';
import { useConfig } from '@/hooks/use-config';
import type { Site } from '@/lib/types';
import { toast } from 'sonner';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Settings,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ExternalLink,
  Image
} from 'lucide-react';

export default function SitesTab() {
  const {
    config,
    addSite,
    updateSite,
    deleteSite,
    updateCategoryOrder,
    updateBottomBannerOrder
  } = useConfig();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');

  // File upload states
  const [addFormLogo, setAddFormLogo] = useState<string>('');
  const [addFormBackground, setAddFormBackground] = useState<string>('');
  const [editFormLogos, setEditFormLogos] = useState<Record<string, string>>({});
  const [editFormBackgrounds, setEditFormBackgrounds] = useState<Record<string, string>>({});

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!addFormLogo) {
      toast.error('Lütfen site logosu seçin');
      return;
    }

    const newSite: Site = {
      id: Date.now().toString(),
      site: formData.get('site') as string,
      url: formData.get('url') as string,
      desc: [
        formData.get('desc1') as string,
        formData.get('desc2') as string
      ],
      sitepic: addFormLogo,
      background_image: addFormBackground,
      color: '#FF9900', // Default color, will be auto-detected by color thief
      button_text: formData.get('button_text') as string,
    };

    addSite(newSite);
    setShowAddForm(false);
    setAddFormLogo('');
    setAddFormBackground('');
    toast.success('Site eklendi');

    // Reset form
    e.currentTarget.reset();
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>, siteId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateSite(siteId, {
      site: formData.get('site') as string,
      url: formData.get('url') as string,
      desc: [
        formData.get('desc1') as string,
        formData.get('desc2') as string
      ],
      sitepic: editFormLogos[siteId] || config.sites.find(s => s.id === siteId)?.sitepic || '',
      background_image: editFormBackgrounds[siteId] || config.sites.find(s => s.id === siteId)?.background_image || '',
      color: config.sites.find(s => s.id === siteId)?.color || '#FF9900', // Keep existing color
      button_text: formData.get('button_text') as string,
    });

    setEditingId(null);
    toast.success('Site güncellendi');
  };

  const handleDelete = (siteId: string, siteName: string) => {
    if (confirm(`"${siteName}" sitesini silmek istediğinizden emin misiniz? Bu site tüm kategorilerden de kaldırılacak.`)) {
      deleteSite(siteId);
      toast.success('Site silindi');
    }
  };

  const moveSiteInCategory = (category: string, siteId: string, direction: 'up' | 'down') => {
    const currentOrder = category === 'bottom_banner'
      ? config.categories.bottom_banner.sites
      : config.categories[category as keyof typeof config.categories] as string[];

    const currentIndex = currentOrder.indexOf(siteId);
    if (currentIndex === -1) return;

    const newOrder = [...currentOrder];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= newOrder.length) return;

    // Swap elements
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

    if (category === 'bottom_banner') {
      updateBottomBannerOrder(newOrder);
    } else {
      updateCategoryOrder(category as keyof typeof config.categories, newOrder);
    }

    toast.success('Sıralama güncellendi');
  };

  const addToCategory = (category: string, siteId: string) => {
    const currentOrder = category === 'bottom_banner'
      ? config.categories.bottom_banner.sites
      : config.categories[category as keyof typeof config.categories] as string[];

    if (currentOrder.includes(siteId)) {
      toast.error('Site zaten bu kategoride mevcut');
      return;
    }

    const newOrder = [...currentOrder, siteId];

    if (category === 'bottom_banner') {
      updateBottomBannerOrder(newOrder);
    } else {
      updateCategoryOrder(category as keyof typeof config.categories, newOrder);
    }

    toast.success('Site kategoriye eklendi');
  };

  const removeFromCategory = (category: string, siteId: string) => {
    const currentOrder = category === 'bottom_banner'
      ? config.categories.bottom_banner.sites
      : config.categories[category as keyof typeof config.categories] as string[];

    const newOrder = currentOrder.filter(id => id !== siteId);

    if (category === 'bottom_banner') {
      updateBottomBannerOrder(newOrder);
    } else {
      updateCategoryOrder(category as keyof typeof config.categories, newOrder);
    }

    toast.success('Site kategoriden çıkarıldı');
  };

  const renderSiteForm = (
    site?: Site,
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void,
    onLogoChange?: (file: string | null) => void,
    onBackgroundChange?: (file: string | null) => void,
    logoValue?: string,
    backgroundValue?: string
  ) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Site Adı</Label>
          <Input
            name="site"
            defaultValue={site?.site}
            required
            placeholder="mistycasino"
            className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white">Site URL</Label>
          <Input
            name="url"
            type="url"
            defaultValue={site?.url}
            required
            placeholder="https://example.com"
            className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Açıklama 1</Label>
          <Input
            name="desc1"
            defaultValue={site?.desc[0]}
            required
            placeholder="1000 TL & 333 FS DENEME BONUSU"
            className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white">Açıklama 2</Label>
          <Input
            name="desc2"
            defaultValue={site?.desc[1]}
            required
            placeholder="%10 KAYIP BONUSU"
            className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      <FileUpload
        label="Site Logo"
        value={logoValue || site?.sitepic}
        onChange={onLogoChange || (() => {})}
        placeholder="Site logosu seçin"
        accept="image/*"
      />

      <FileUpload
        label="Arka Plan Görseli (Animated Hover)"
        value={backgroundValue || site?.background_image}
        onChange={onBackgroundChange || (() => {})}
        placeholder="Arka plan görseli seçin (opsiyonel)"
        accept="image/*"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white flex items-center gap-2">
            <span>🎨</span>
            Tema Rengi (Otomatik)
          </Label>
          <div className="bg-slate-600 border border-slate-500 rounded-lg p-4 text-center">
            <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: site?.color || '#FF9900' }} />
            <p className="text-gray-300 text-sm">Logo yüklendiğinde otomatik tespit edilir</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white">Buton Metni</Label>
          <Input
            name="button_text"
            defaultValue={site?.button_text}
            required
            placeholder="GİRİŞ YAP"
            className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
          />
        </div>
      </div>
    </form>
  );

  const renderCategorySection = (categoryKey: string, categoryName: string, siteIds: string[]) => (
    <Card key={categoryKey} className="bg-slate-700/30 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white text-lg">{categoryName}</CardTitle>
        <CardDescription className="text-gray-300">
          Bu kategorideki sitelerin sıralamasını düzenleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        {siteIds.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Bu kategoride henüz site yok</p>
            <p className="text-sm">Aşağıdaki sitelerden istediğinizi ekleyebilirsiniz</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {siteIds.map((siteId, index) => {
              const site = config.sites.find(s => s.site === siteId);
              if (!site) return null;

              return (
                <div key={siteId} className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: site.color }} />
                    <div>
                      <p className="text-white font-medium">{site.site}</p>
                      <p className="text-sm text-gray-400">{site.desc[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveSiteInCategory(categoryKey, siteId, 'up')}
                      disabled={index === 0}
                      className="border-slate-500 text-white hover:bg-slate-600"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveSiteInCategory(categoryKey, siteId, 'down')}
                      disabled={index === siteIds.length - 1}
                      className="border-slate-500 text-white hover:bg-slate-600"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCategory(categoryKey, siteId)}
                      className="border-red-600 text-red-400 hover:bg-red-700/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add site buttons */}
        <div className="border-t border-slate-600 pt-4">
          <p className="text-white font-medium mb-2">Site Ekle:</p>
          <div className="flex flex-wrap gap-2">
            {config.sites.filter(site => !siteIds.includes(site.site)).map(site => (
              <Button
                key={site.id}
                size="sm"
                variant="outline"
                onClick={() => addToCategory(categoryKey, site.site)}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                {site.site}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="manage" className="data-[state=active]:bg-slate-700">
            Site Yönetimi
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-slate-700">
            Kategori Sıralaması
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Site Yönetimi
              </CardTitle>
              <CardDescription className="text-gray-300">
                Sitelerinizi ekleyin, düzenleyin ve silin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Add New Site Button */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">Mevcut Siteler</p>
                  <p className="text-sm text-gray-400">
                    Toplam {config.sites.length} site tanımlanmış
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={showAddForm}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Site Ekle
                </Button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Yeni Site Ekle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderSiteForm(
                      undefined,
                      handleAdd,
                      setAddFormLogo,
                      setAddFormBackground,
                      addFormLogo,
                      addFormBackground
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
                        className="border-slate-600 text-white hover:bg-slate-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        İptal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Sites */}
              <div className="space-y-4">
                {config.sites.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz site eklenmemiş</p>
                    <p className="text-sm">Yukarıdaki butonu kullanarak ilk sitenizi ekleyin</p>
                  </div>
                ) : (
                  config.sites.map((site) => (
                    <Card key={site.id} className="bg-slate-700/30 border-slate-600">
                      <CardContent className="p-4">
                        {editingId === site.id ? (
                          <div>
                            {renderSiteForm(
                              site,
                              (e) => handleEdit(e, site.id),
                              (file) => setEditFormLogos(prev => ({ ...prev, [site.id]: file || '' })),
                              (file) => setEditFormBackgrounds(prev => ({ ...prev, [site.id]: file || '' })),
                              editFormLogos[site.id] || site.sitepic,
                              editFormBackgrounds[site.id] || site.background_image
                            )}
                            <div className="flex gap-2 mt-4">
                              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                <Save className="w-4 h-4 mr-2" />
                                Kaydet
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                                className="border-slate-600 text-white hover:bg-slate-700"
                              >
                                <X className="w-4 h-4 mr-2" />
                                İptal
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: site.color }}
                              >
                                <img
                                  src={site.sitepic}
                                  alt={site.site}
                                  className="w-8 h-8 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <p className="text-white font-medium">{site.site}</p>
                                <p className="text-sm text-gray-400">{site.desc[0]}</p>
                                <p className="text-xs text-gray-500">{site.desc[1]}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">
                                    {site.button_text}
                                  </Badge>
                                  <a
                                    href={site.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(site.id)}
                                className="border-slate-600 text-white hover:bg-slate-700"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(site.id, site.site)}
                                className="border-red-600 text-red-400 hover:bg-red-700/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Kategori Sıralaması</CardTitle>
              <CardDescription className="text-gray-300">
                Sitelerin kategorilerdeki sıralamasını düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              {config.sites.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Kategori sıralaması için önce siteler eklemelisiniz</p>
                  <p className="text-sm">"Site Yönetimi" sekmesinden site ekleyebilirsiniz</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {renderCategorySection('left_fix', 'Sol Sabit Banner', config.categories.left_fix)}
                  {renderCategorySection('right_fix', 'Sağ Sabit Banner', config.categories.right_fix)}
                  {renderCategorySection('scrolling_banner', 'Kayan Banner', config.categories.scrolling_banner)}
                  {renderCategorySection('slider_banners', 'Slider Banner', config.categories.slider_banners)}
                  {renderCategorySection('animated_hover', 'Animasyonlu Hover', config.categories.animated_hover)}
                  {renderCategorySection('vip_sites', 'VIP Siteler', config.categories.vip_sites)}
                  {renderCategorySection('bottom_banner', 'Alt Banner', config.categories.bottom_banner.sites)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
