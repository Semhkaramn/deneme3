'use client';

import type { Configuration } from './types';
import { defaultConfig } from './default-config';

const CONFIG_KEY = 'sago-casino-config';

export class ConfigStore {
  static getConfig(): Configuration {
    if (typeof window === 'undefined') return defaultConfig;

    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return defaultConfig;
  }

  static saveConfig(config: Configuration): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  static exportConfig(): string {
    const config = ConfigStore.getConfig();
    return JSON.stringify(config, null, 2);
  }

  static importConfig(jsonString: string): boolean {
    try {
      const config = JSON.parse(jsonString);
      ConfigStore.saveConfig(config);
      return true;
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  }

  static resetConfig(): void {
    ConfigStore.saveConfig(defaultConfig);
  }
}
