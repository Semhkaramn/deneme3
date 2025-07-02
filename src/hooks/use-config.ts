'use client';

import { useState, useEffect } from 'react';
import type { Configuration, Site, HeaderLink, ThemeColors } from '@/lib/types';
import { GlobalConfigStore } from '@/lib/global-config-store';
import { defaultConfig } from '@/lib/default-config';

export function useConfig() {
  const [config, setConfig] = useState<Configuration>(() => GlobalConfigStore.getLocalConfig());
  const [isLoading, setIsLoading] = useState(true);

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const loadedConfig = await GlobalConfigStore.getConfig();
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Config loading error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();

    // Start auto-sync
    GlobalConfigStore.startAutoSync();
  }, []);

  const saveConfig = async (newConfig: Configuration) => {
    setConfig(newConfig);
    await GlobalConfigStore.saveConfig(newConfig);
  };

  const updateSiteConfig = async (updates: Partial<Configuration['site_config']>) => {
    const newConfig = {
      ...config,
      site_config: { ...config.site_config, ...updates }
    };
    await saveConfig(newConfig);
  };

  const updateThemeColors = async (updates: Partial<ThemeColors>) => {
    const newConfig = {
      ...config,
      theme_colors: { ...config.theme_colors, ...updates }
    };
    await saveConfig(newConfig);
  };

  const updateCategoriesControl = async (updates: Partial<Configuration['categories_control']>) => {
    const newConfig = {
      ...config,
      categories_control: { ...config.categories_control, ...updates }
    };
    await saveConfig(newConfig);
  };

  const updateSocialLinks = async (updates: Partial<Configuration['social_links']>) => {
    const newConfig = {
      ...config,
      social_links: { ...config.social_links, ...updates }
    };
    await saveConfig(newConfig);
  };

  const updatePopupSettings = async (updates: Partial<Configuration['popup_settings']>) => {
    const newConfig = {
      ...config,
      popup_settings: { ...config.popup_settings, ...updates }
    };
    await saveConfig(newConfig);
  };

  const updateAdminSettings = async (updates: Partial<Configuration['admin_settings']>) => {
    const newConfig = {
      ...config,
      admin_settings: { ...config.admin_settings, ...updates }
    };
    await saveConfig(newConfig);
  };

  const addSite = async (site: Site) => {
    const newConfig = {
      ...config,
      sites: [...config.sites, site]
    };
    await saveConfig(newConfig);
  };

  const updateSite = async (siteId: string, updates: Partial<Site>) => {
    const newConfig = {
      ...config,
      sites: config.sites.map(site =>
        site.id === siteId ? { ...site, ...updates } : site
      )
    };
    await saveConfig(newConfig);
  };

  const deleteSite = async (siteId: string) => {
    const newConfig = {
      ...config,
      sites: config.sites.filter(site => site.id !== siteId),
      categories: {
        ...config.categories,
        left_fix: config.categories.left_fix.filter(id => id !== siteId),
        right_fix: config.categories.right_fix.filter(id => id !== siteId),
        scrolling_banner: config.categories.scrolling_banner.filter(id => id !== siteId),
        slider_banners: config.categories.slider_banners.filter(id => id !== siteId),
        animated_hover: config.categories.animated_hover.filter(id => id !== siteId),
        vip_sites: config.categories.vip_sites.filter(id => id !== siteId),
        bottom_banner: {
          ...config.categories.bottom_banner,
          sites: config.categories.bottom_banner.sites.filter(id => id !== siteId)
        }
      }
    };
    await saveConfig(newConfig);
  };

  const addHeaderLink = async (link: HeaderLink) => {
    const newConfig = {
      ...config,
      header_links: [...config.header_links, link]
    };
    await saveConfig(newConfig);
  };

  const updateHeaderLink = async (linkId: string, updates: Partial<HeaderLink>) => {
    const newConfig = {
      ...config,
      header_links: config.header_links.map(link =>
        link.id === linkId ? { ...link, ...updates } : link
      )
    };
    await saveConfig(newConfig);
  };

  const deleteHeaderLink = async (linkId: string) => {
    const newConfig = {
      ...config,
      header_links: config.header_links.filter(link => link.id !== linkId)
    };
    await saveConfig(newConfig);
  };

  const updateCategoryOrder = async (category: keyof Configuration['categories'], newOrder: string[]) => {
    if (category === 'bottom_banner') return;

    // Apply site limits
    const limits = config.site_limits;
    let limitedOrder = newOrder;

    if (category === 'left_fix' && newOrder.length > limits.left_fix) {
      limitedOrder = newOrder.slice(0, limits.left_fix);
    } else if (category === 'right_fix' && newOrder.length > limits.right_fix) {
      limitedOrder = newOrder.slice(0, limits.right_fix);
    } else if (category === 'animated_hover' && newOrder.length > limits.animated_hover) {
      limitedOrder = newOrder.slice(0, limits.animated_hover);
    }

    const newConfig = {
      ...config,
      categories: {
        ...config.categories,
        [category]: limitedOrder
      }
    };
    await saveConfig(newConfig);
  };

  const updateBottomBannerOrder = async (newOrder: string[]) => {
    const newConfig = {
      ...config,
      categories: {
        ...config.categories,
        bottom_banner: {
          ...config.categories.bottom_banner,
          sites: newOrder
        }
      }
    };
    await saveConfig(newConfig);
  };

  const canAddToCategory = (category: string, currentCount: number): boolean => {
    const limits = config.site_limits;
    switch (category) {
      case 'left_fix':
        return currentCount < limits.left_fix;
      case 'right_fix':
        return currentCount < limits.right_fix;
      case 'animated_hover':
        return currentCount < limits.animated_hover;
      default:
        return true;
    }
  };

  const exportConfig = async () => {
    return await GlobalConfigStore.exportConfig();
  };

  const importConfig = async (jsonString: string) => {
    const success = await GlobalConfigStore.importConfig(jsonString);
    if (success) {
      const newConfig = await GlobalConfigStore.getConfig();
      setConfig(newConfig);
      return true;
    }
    return false;
  };

  const resetConfig = async () => {
    await GlobalConfigStore.resetConfig();
    const newConfig = await GlobalConfigStore.getConfig();
    setConfig(newConfig);
  };

  return {
    config,
    isLoading,
    updateSiteConfig,
    updateThemeColors,
    updateCategoriesControl,
    updateSocialLinks,
    updatePopupSettings,
    updateAdminSettings,
    addSite,
    updateSite,
    deleteSite,
    addHeaderLink,
    updateHeaderLink,
    deleteHeaderLink,
    updateCategoryOrder,
    updateBottomBannerOrder,
    canAddToCategory,
    exportConfig,
    importConfig,
    resetConfig
  };
}
