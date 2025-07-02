import type { Configuration } from './types';

export const defaultConfig: Configuration = {
  site_config: {
    title: "Sago Casino",
    description: "En iyi casino deneyimi",
    favicon: "",
    logo: "",
    url: "https://sagocasino.com"
  },
  theme_colors: {
    bg: '#0E184E',
    menu: '#172261',
    card: '#162160',
    card2: '#111C4F'
  },
  categories_control: {
    show_left_fix: true,
    show_right_fix: true,
    show_vip_sites: true,
    show_animated_hover: true,
    show_slider_banner: true,
    show_scrolling_banner: true,
    show_bottom_banner: true,
    show_popup_banner: false
  },
  social_links: {
    telegram_main: "",
    telegram_announcement: "",
    telegram_chat: "",
    instagram: "",
    youtube: "",
    header_links: []
  },
  header_links: [],
  popup_settings: {
    enabled: false,
    delay: 3000,
    title: "TELEGRAM KOD KANALI",
    main_text: "TELEGRAM KOD KANALIMIZA KATILIN KAZANMAYA BAŞLAYIN!",
    sub_text: "HERGÜN YÜZLERCE BEDAVA KOD",
    site_ref: ""
  },
  footer: {
    licence_text: "Bu site 18+ yaş sınırı gerektirir",
    copyright_text: "© 2024 Sago Casino",
    copyright_url: "https://sagocasino.com"
  },
  sites: [],
  categories: {
    left_fix: [],
    right_fix: [],
    scrolling_banner: [],
    slider_banners: [],
    animated_hover: [],
    vip_sites: [],
    bottom_banner: {
      sites: [],
      rotation_interval: 4000
    }
  },
  site_limits: {
    left_fix: 1,
    right_fix: 1,
    animated_hover: 4
  },
  admin_settings: {
    auto_logout_minutes: 30,
    session_timeout: 1800000 // 30 minutes in milliseconds
  }
};
