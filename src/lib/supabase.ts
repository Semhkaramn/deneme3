import { createClient } from '@supabase/supabase-js';
import type { Configuration } from './types';

// Public Supabase URL ve Key (güvenli, RLS ile korunacak)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration types for Supabase
export interface CloudConfig {
  id?: string;
  share_code: string;
  configuration: Configuration;
  created_at?: string;
  updated_at?: string;
  access_count?: number;
  description?: string;
}

// Cloud configuration functions
export class CloudConfigStore {
  // Konfigürasyonu cloud'a yükle ve share code döndür
  static async uploadConfig(config: Configuration, description?: string): Promise<string> {
    try {
      // Random share code oluştur (6 haneli)
      const shareCode = Math.random().toString(36).substr(2, 6).toUpperCase();

      const { data, error } = await supabase
        .from('configurations')
        .insert({
          share_code: shareCode,
          configuration: config,
          description: description || 'Casino Konfigürasyonu',
          access_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      return shareCode;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Konfigürasyon yüklenemedi');
    }
  }

  // Share code ile konfigürasyonu indir
  static async downloadConfig(shareCode: string): Promise<Configuration> {
    try {
      const { data, error } = await supabase
        .from('configurations')
        .select('*')
        .eq('share_code', shareCode.toUpperCase())
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Konfigürasyon bulunamadı');
      }

      // Access count'u artır
      await supabase
        .from('configurations')
        .update({ access_count: (data.access_count || 0) + 1 })
        .eq('share_code', shareCode.toUpperCase());

      return data.configuration;
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Konfigürasyon indirilemedi');
    }
  }

  // Share code'un geçerli olup olmadığını kontrol et
  static async validateShareCode(shareCode: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('configurations')
        .select('id')
        .eq('share_code', shareCode.toUpperCase())
        .single();

      return !!data;
    } catch {
      return false;
    }
  }

  // Test bağlantısı
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('configurations')
        .select('count(*)')
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }
}

// Fallback mode - localStorage kullan
export const isCloudAvailable = () => {
  return supabaseUrl !== 'https://example.supabase.co' && supabaseKey !== 'your-anon-key';
};
