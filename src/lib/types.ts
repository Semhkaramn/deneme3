export interface SiteConfig {
  title: string;
  description: string;
  favicon: string;
  logo: string;
  url: string;
}

export interface SocialLinks {
  telegram_main: string;
  telegram_announcement: string;
  telegram_chat: string;
  instagram: string;
  youtube: string;
}

export interface CategoriesControl {
  show_left_fix: boolean;
  show_right_fix: boolean;
  show_vip_sites: boolean;
  show_diamond_sites: boolean;
  show_normal_sites: boolean;
  show_animated_hover: boolean;
  show_slider_banner: boolean;
  show_scrolling_banner: boolean;
  show_bottom_banner: boolean;
  show_popup_banner: boolean;
}

export interface HeaderLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  icon: string;
}

export interface PopupSettings {
  enabled: boolean;
  delay: number;
  title: string;
  main_text: string;
  sub_text: string;
  site_ref: string;
}

export interface Footer {
  licence_text: string;
  copyright_text: string;
  copyright_url: string;
}

export interface Site {
  id: string;
  site: string;
  url: string;
  desc: [string, string];
  sitepic: string;
  background_image?: string;
  color: string;
  button_text: string;
}

export interface BottomBanner {
  sites: string[];
  rotation_interval: number;
}

export interface Categories {
  left_fix: string[];
  right_fix: string[];
  scrolling_banner: string[];
  slider_banners: string[];
  animated_hover: string[];
  vip_sites: string[];
  bottom_banner: BottomBanner;
}

export interface Configuration {
  site_config: SiteConfig;
  categories_control: CategoriesControl;
  social_links: SocialLinks;
  header_links: HeaderLink[];
  popup_settings: PopupSettings;
  footer: Footer;
  sites: Site[];
  categories: Categories;
}
