'use client';

import type { Configuration } from './types';
import { defaultConfig } from './default-config';
import { supabase, isCloudAvailable } from './supabase';

// Global configuration ID - bu proje için tek bir konfigürasyon
const GLOBAL_CONFIG_ID = 'sago-casino-main-config';
const LOCAL_CONFIG_KEY = 'sago-casino-config';

export class GlobalConfigStore {
  private static isLoading = false;
  private static lastSync = 0;
  private static syncInterval = 30000; // 30 saniye

  /**
   * Ana konfigürasyonu getir - önce cloud'dan, sonra localStorage'dan
   */
  static async getConfig(): Promise<Configuration> {
    // Cloud sync kullanılamıyorsa localStorage'a geri dön
    if (!isCloudAvailable()) {
      return this.getLocalConfig();
    }

    try {
      // Çok sık sync yapmamak için throttle
      const now = Date.now();
      if (this.isLoading || (now - this.lastSync) < 5000) {
        return this.getLocalConfig();
      }

      this.isLoading = true;
      this.lastSync = now;

      // Cloud'dan konfigürasyonu getir
      const { data, error } = await supabase
        .from('global_configs')
        .select('configuration')
        .eq('config_id', GLOBAL_CONFIG_ID)
        .single();

      if (error || !data) {
        // İlk defa kullanılıyorsa default config'i cloud'a yükle
        await this.saveConfig(defaultConfig);
        return defaultConfig;
      }

      const cloudConfig = data.configuration as Configuration;

      // Cloud config'i localStorage'a da kaydet (cache)
      this.saveLocalConfig(cloudConfig);

      return cloudConfig;

    } catch (error) {
      console.warn('Cloud config getirme hatası:', error);
      return this.getLocalConfig();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Konfigürasyonu kaydet - hem cloud'a hem localStorage'a
   */
  static async saveConfig(config: Configuration): Promise<boolean> {
    try {
      // localStorage'a hemen kaydet
      this.saveLocalConfig(config);

      // Cloud sync kullanılabiliyorsa cloud'a da kaydet
      if (isCloudAvailable()) {
        const { error } = await supabase
          .from('global_configs')
          .upsert({
            config_id: GLOBAL_CONFIG_ID,
            configuration: config,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.warn('Cloud kaydetme hatası:', error);
          return false;
        }

        console.log('✅ Konfigürasyon cloud\'a kaydedildi');
      }

      return true;
    } catch (error) {
      console.error('Konfigürasyon kaydetme hatası:', error);
      return false;
    }
  }

  /**
   * localStorage'dan konfigürasyon getir
   */
  static getLocalConfig(): Configuration {
    if (typeof window === 'undefined') return defaultConfig;

    try {
      const stored = localStorage.getItem(LOCAL_CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('LocalStorage okuma hatası:', error);
    }
    return defaultConfig;
  }

  /**
   * localStorage'a konfigürasyon kaydet
   */
  private static saveLocalConfig(config: Configuration): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('LocalStorage yazma hatası:', error);
    }
  }

  /**
   * Konfigürasyonu sıfırla
   */
  static async resetConfig(): Promise<void> {
    await this.saveConfig(defaultConfig);
  }

  /**
   * Manuel sync - cloud'dan en son hali getir
   */
  static async forceSync(): Promise<Configuration> {
    this.lastSync = 0; // Throttle'ı sıfırla
    return await this.getConfig();
  }

  /**
   * Cloud bağlantısını test et
   */
  static async testCloudConnection(): Promise<boolean> {
    if (!isCloudAvailable()) return false;

    try {
      const { error } = await supabase
        .from('global_configs')
        .select('config_id')
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Auto-sync için background sync başlat
   */
  static startAutoSync(): void {
    if (!isCloudAvailable()) return;

    setInterval(async () => {
      try {
        await this.getConfig(); // Bu otomatik olarak sync yapar
      } catch (error) {
        console.warn('Auto-sync hatası:', error);
      }
    }, this.syncInterval);
  }

  /**
   * Export fonksiyonu
   */
  static async exportConfig(): Promise<string> {
    const config = await this.getConfig();
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import fonksiyonu
   */
  static async importConfig(jsonString: string): Promise<boolean> {
    try {
      const config = JSON.parse(jsonString);
      return await this.saveConfig(config);
    } catch (error) {
      console.error('Import hatası:', error);
      return false;
    }
  }
}
