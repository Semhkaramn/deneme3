import type { Configuration } from './types';

export const defaultConfig: Configuration = {
  site_config: {
    title: "",
    description: "",
    favicon: "",
    logo: "",
    url: ""
  },
  categories_control: {
    show_left_fix: false,
    show_right_fix: false,
    show_vip_sites: false,
    show_diamond_sites: false,
    show_normal_sites: false,
    show_animated_hover: false,
    show_slider_banner: false,
    show_scrolling_banner: false,
    show_bottom_banner: false,
    show_popup_banner: false
  },
  social_links: {
    telegram_main: "",
    telegram_announcement: "",
    telegram_chat: "",
    instagram: "",
    youtube: ""
  },
  header_links: [],
  popup_settings: {
    enabled: false,
    delay: 3000,
    title: "",
    main_text: "",
    sub_text: "",
    site_ref: ""
  },
  footer: {
    licence_text: "",
    copyright_text: "",
    copyright_url: ""
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
  }
};
