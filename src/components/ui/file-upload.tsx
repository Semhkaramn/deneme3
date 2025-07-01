'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  value?: string;
  onChange: (file: string | null) => void;
  placeholder?: string;
}

export function FileUpload({ label, accept = "image/*", value, onChange, placeholder }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label className="text-white">{label}</Label>

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 bg-slate-700/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Görsel yüklendi</p>
                <p className="text-gray-400 text-xs">Değiştirmek için yeni bir dosya seçin</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleClick}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Değiştir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRemove}
                  className="border-red-600 text-red-400 hover:bg-red-700/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer transition-colors"
        >
          <div className="text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-white font-medium mb-2">
              {placeholder || "Görsel seçin"}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              JPG, PNG, GIF formatları desteklenir
            </p>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Dosya Seç
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
