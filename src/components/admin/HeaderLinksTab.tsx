'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { useConfig } from '@/hooks/use-config';
import type { HeaderLink } from '@/lib/types';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Link, Save, X } from 'lucide-react';

export default function HeaderLinksTab() {
  const { config, addHeaderLink, updateHeaderLink, deleteHeaderLink } = useConfig();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Upload states
  const [addFormIcon, setAddFormIcon] = useState<string>('');
  const [editFormIcons, setEditFormIcons] = useState<Record<string, string>>({});

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!addFormIcon) {
      toast.error('Lütfen ikon görseli seçin');
      return;
    }

    const newLink: HeaderLink = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      url: formData.get('url') as string,
      icon: addFormIcon,
    };

    await addHeaderLink(newLink);
    setShowAddForm(false);
    setAddFormIcon('');
    toast.success('Header linki eklendi');

    // Reset form
    e.currentTarget.reset();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, linkId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentLink = config.header_links.find(l => l.id === linkId);

    await updateHeaderLink(linkId, {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      url: formData.get('url') as string,
      icon: editFormIcons[linkId] || currentLink?.icon || '',
    });

    setEditingId(null);
    setEditFormIcons(prev => {
      const newData = { ...prev };
      delete newData[linkId];
      return newData;
    });
    toast.success('Header linki güncellendi');
  };

  const handleDelete = async (linkId: string, title: string) => {
    if (confirm(`"${title}" linkini silmek istediğinizden emin misiniz?`)) {
      await deleteHeaderLink(linkId);
      toast.success('Header linki silindi');
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Link className="w-5 h-5" />
          Header Linkleri
        </CardTitle>
        <CardDescription className="text-gray-300">
          Site header'ında görünecek linkleri düzenleyin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Add New Link Button */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-medium">Mevcut Linkler</p>
            <p className="text-sm text-gray-400">
              Toplam {config.header_links.length} link tanımlanmış
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={showAddForm}
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Link Ekle
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Yeni Header Link Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-title" className="text-white">Başlık *</Label>
                    <Input
                      id="add-title"
                      name="title"
                      required
                      placeholder="DUYURU KANALIMIZ"
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-subtitle" className="text-white">Alt Başlık *</Label>
                    <Input
                      id="add-subtitle"
                      name="subtitle"
                      required
                      placeholder="Telegram"
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-url" className="text-white">URL *</Label>
                  <Input
                    id="add-url"
                    name="url"
                    type="url"
                    required
                    placeholder="https://t.me/sagoduyuruetkinlik"
                    className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                  />
                </div>

                <FileUpload
                  label="İkon Görseli *"
                  value={addFormIcon}
                  onChange={(file) => setAddFormIcon(file || '')}
                  placeholder="İkon görseli seçin (PNG, SVG, JPG)"
                  accept="image/*"
                />

                <div className="flex gap-2 pt-4 border-t border-slate-600">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setAddFormIcon('');
                    }}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    İptal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing Links */}
        <div className="space-y-4">
          {config.header_links.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz header linki eklenmemiş</p>
              <p className="text-sm">Yukarıdaki butonu kullanarak ilk linkinizi ekleyin</p>
            </div>
          ) : (
            config.header_links.map((link) => (
              <Card key={link.id} className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-4">
                  {editingId === link.id ? (
                    <form onSubmit={(e) => handleEdit(e, link.id)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Başlık *</Label>
                          <Input
                            name="title"
                            defaultValue={link.title}
                            required
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Alt Başlık *</Label>
                          <Input
                            name="subtitle"
                            defaultValue={link.subtitle}
                            required
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">URL *</Label>
                        <Input
                          name="url"
                          type="url"
                          defaultValue={link.url}
                          required
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <FileUpload
                        label="İkon Görseli"
                        value={editFormIcons[link.id] || link.icon}
                        onChange={(file) => setEditFormIcons(prev => ({
                          ...prev,
                          [link.id]: file || ''
                        }))}
                        placeholder="İkon görseli seçin"
                        accept="image/*"
                      />

                      <div className="flex gap-2 pt-4 border-t border-slate-600">
                        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Save className="w-4 h-4 mr-2" />
                          Güncelle
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="border-slate-600 text-white hover:bg-slate-700"
                        >
                          <X className="w-4 h-4 mr-2" />
                          İptal
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                          {link.icon ? (
                            <img
                              src={link.icon}
                              alt={link.title}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Link className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{link.title}</p>
                          <p className="text-sm text-gray-400">{link.subtitle}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 break-all"
                          >
                            {link.url}
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(link.id)}
                          className="border-slate-600 text-white hover:bg-slate-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(link.id, link.title)}
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

        <div className="mt-6 p-4 bg-purple-900/20 border border-purple-600/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-purple-500 rounded-full flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-purple-200 font-medium mb-2">Header Link Bilgileri</h4>
              <ul className="text-purple-100 text-sm space-y-1">
                <li>• Header linkleri site üst kısmında buton olarak görünür</li>
                <li>• İkon görselleri otomatik olarak 24x24 boyutuna optimize edilir</li>
                <li>• Tüm linkler yeni sekmede açılır</li>
                <li>• Sıralama yukarıdan aşağıya soldan sağa doğrudur</li>
                <li>• PNG, SVG, JPG formatları desteklenir</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
