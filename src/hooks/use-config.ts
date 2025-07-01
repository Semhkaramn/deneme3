'use client';

import { useState, useEffect } from 'react';
import type { Configuration, Site, HeaderLink } from '@/lib/types';
import { ConfigStore } from '@/lib/config-store';

export function useConfig() {
  const [config, setConfig] = useState<Configuration>(() => ConfigStore.getConfig());

  const saveConfig = (newConfig: Configuration) => {
    setConfig(newConfig);
    ConfigStore.saveConfig(newConfig);
  };

  const updateSiteConfig = (updates: Partial<Configuration['site_config']>) => {
    const newConfig = {
      ...config,
      site_config: { ...config.site_config, ...updates }
    };
    saveConfig(newConfig);
  };

  const updateCategoriesControl = (updates: Partial<Configuration['categories_control']>) => {
    const newConfig = {
      ...config,
      categories_control: { ...config.categories_control, ...updates }
    };
    saveConfig(newConfig);
  };

  const updateSocialLinks = (updates: Partial<Configuration['social_links']>) => {
    const newConfig = {
      ...config,
      social_links: { ...config.social_links, ...updates }
    };
    saveConfig(newConfig);
  };

  const updatePopupSettings = (updates: Partial<Configuration['popup_settings']>) => {
    const newConfig = {
      ...config,
      popup_settings: { ...config.popup_settings, ...updates }
    };
    saveConfig(newConfig);
  };



  const addSite = (site: Site) => {
    const newConfig = {
      ...config,
      sites: [...config.sites, site]
    };
    saveConfig(newConfig);
  };

  const updateSite = (siteId: string, updates: Partial<Site>) => {
    const newConfig = {
      ...config,
      sites: config.sites.map(site =>
        site.id === siteId ? { ...site, ...updates } : site
      )
    };
    saveConfig(newConfig);
  };

  const deleteSite = (siteId: string) => {
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
    saveConfig(newConfig);
  };

  const addHeaderLink = (link: HeaderLink) => {
    const newConfig = {
      ...config,
      header_links: [...config.header_links, link]
    };
    saveConfig(newConfig);
  };

  const updateHeaderLink = (linkId: string, updates: Partial<HeaderLink>) => {
    const newConfig = {
      ...config,
      header_links: config.header_links.map(link =>
        link.id === linkId ? { ...link, ...updates } : link
      )
    };
    saveConfig(newConfig);
  };

  const deleteHeaderLink = (linkId: string) => {
    const newConfig = {
      ...config,
      header_links: config.header_links.filter(link => link.id !== linkId)
    };
    saveConfig(newConfig);
  };

  const updateCategoryOrder = (category: keyof Configuration['categories'], newOrder: string[]) => {
    if (category === 'bottom_banner') return;

    const newConfig = {
      ...config,
      categories: {
        ...config.categories,
        [category]: newOrder
      }
    };
    saveConfig(newConfig);
  };

  const updateBottomBannerOrder = (newOrder: string[]) => {
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
    saveConfig(newConfig);
  };

  const exportConfig = () => {
    return ConfigStore.exportConfig();
  };

  const importConfig = (jsonString: string) => {
    if (ConfigStore.importConfig(jsonString)) {
      setConfig(ConfigStore.getConfig());
      return true;
    }
    return false;
  };

  const resetConfig = () => {
    ConfigStore.resetConfig();
    setConfig(ConfigStore.getConfig());
  };

  useEffect(() => {
    setConfig(ConfigStore.getConfig());
  }, []);

  return {
    config,
    updateSiteConfig,
    updateCategoriesControl,
    updateSocialLinks,
    updatePopupSettings,
    addSite,
    updateSite,
    deleteSite,
    addHeaderLink,
    updateHeaderLink,
    deleteHeaderLink,
    updateCategoryOrder,
    updateBottomBannerOrder,
    exportConfig,
    importConfig,
    resetConfig
  };
}
