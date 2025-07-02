'use client';

import { useEffect, useState } from 'react';
import { GlobalConfigStore } from '@/lib/global-config-store';
import type { Configuration } from '@/lib/types';

export default function PreviewPage() {
  const [config, setConfig] = useState<Configuration | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const loadedConfig = await GlobalConfigStore.getConfig();
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Preview config loading error:', error);
        // Fallback to local config
        const localConfig = GlobalConfigStore.getLocalConfig();
        setConfig(localConfig);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    if (!config) return;

    // Apply configuration to document
    if (config.site_config.title) {
      document.title = config.site_config.title;
    }

    // Add favicon
    if (config.site_config.favicon) {
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      favicon.type = 'image/x-icon';
      favicon.rel = 'shortcut icon';
      favicon.href = config.site_config.favicon;
      document.getElementsByTagName('head')[0].appendChild(favicon);
    }

    // Load external CSS and scripts
    const loadExternalResources = () => {
      // Load app.css
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = '/app.css';
      document.head.appendChild(cssLink);

      // Load Google Fonts
      const fontLink1 = document.createElement('link');
      fontLink1.href = 'https://fonts.googleapis.com/css2?family=Roboto&display=swap';
      fontLink1.rel = 'stylesheet';
      document.head.appendChild(fontLink1);

      const fontLink2 = document.createElement('link');
      fontLink2.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap';
      fontLink2.rel = 'stylesheet';
      document.head.appendChild(fontLink2);

      // Load Swiper CSS
      const swiperCSS = document.createElement('link');
      swiperCSS.rel = 'stylesheet';
      swiperCSS.href = 'https://unpkg.com/swiper/swiper-bundle.min.css';
      document.head.appendChild(swiperCSS);
    };

    loadExternalResources();
  }, [config]);

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Konfigürasyon yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div
        id="app-v-page"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          color: '#fff',
          background: '#0E184E',
          paddingBottom: '80px'
        }}
      >
        {/* Header */}
        <header style={{
          height: '70px',
          background: '#172261',
          display: 'flex',
          alignItems: 'center',
          padding: '0 30px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ width: '100px' }}>
              {config.site_config.logo && (
                <img src={config.site_config.logo} alt="Logo" style={{ width: '100%' }} />
              )}
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {config.social_links.telegram_main && (
                <a
                  href={config.social_links.telegram_main}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#2277FF',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}
                >
                  📱 Telegram
                </a>
              )}
              {config.social_links.instagram && (
                <a
                  href={config.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#FF22BB',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}
                >
                  📷 Instagram
                </a>
              )}
            </div>

            {/* Header Links */}
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '10px' }}>
              {config.header_links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#162160',
                      padding: '7px 12px',
                      borderRadius: '10px',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      gap: '10px'
                    }}
                  >
                    <img src={link.icon} width="30" alt="Icon" />
                    <div>
                      <p style={{ margin: 0 }}>{link.title}</p>
                      <small style={{ textTransform: 'uppercase' }}>{link.subtitle}</small>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* Scrolling Banner */}
        {config.categories_control.show_scrolling_banner && config.categories.scrolling_banner.length > 0 && (
          <div style={{
            width: '100%',
            background: '#172261',
            padding: '10px 0',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              gap: '40px',
              animation: 'marquee 15s linear infinite',
              whiteSpace: 'nowrap'
            }}>
              {config.categories.scrolling_banner.map((siteName) => {
                const site = config.sites.find(s => s.site === siteName);
                if (!site) return null;
                return (
                  <a
                    key={siteName}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '5px 15px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      textDecoration: 'none',
                      gap: '10px'
                    }}
                  >
                    <img src={site.sitepic} alt={site.site} style={{ height: '30px' }} />
                    <div style={{
                      background: site.color,
                      padding: '3px 8px',
                      borderRadius: '15px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {site.button_text}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Container */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '30px'
        }}>

          {/* Animated Hover Sites */}
          {config.categories_control.show_animated_hover && config.categories.animated_hover.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '40px'
            }}>
              {config.categories.animated_hover.map((siteName) => {
                const site = config.sites.find(s => s.site === siteName);
                if (!site) return null;
                return (
                  <div
                    key={siteName}
                    style={{
                      position: 'relative',
                      width: 'calc(25% - 10px)',
                      height: '300px',
                      overflow: 'hidden',
                      borderRadius: '20px',
                      border: `2px solid ${site.color}`,
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={site.background_image || ''}
                      alt={site.site}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '20px'
                      }}
                    />
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        color: '#fff',
                        textDecoration: 'none'
                      }}
                    >
                      <img
                        src={site.sitepic}
                        alt={site.site}
                        style={{
                          width: '80%',
                          marginBottom: '10px'
                        }}
                      />
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}>
                        {site.desc[0]}<br />{site.desc[1]}
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIP Sites */}
          {config.categories_control.show_vip_sites && config.categories.vip_sites.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '40px'
            }}>
              {config.categories.vip_sites.map((siteName) => {
                const site = config.sites.find(s => s.site === siteName);
                if (!site) return null;
                return (
                  <div
                    key={siteName}
                    style={{
                      width: 'calc(25% - 15px)',
                      background: '#162160',
                      border: `2px solid ${site.color}`,
                      padding: '20px',
                      borderRadius: '30px',
                      position: 'relative'
                    }}
                  >
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#fff',
                        textDecoration: 'none'
                      }}
                    >
                      <img src={site.sitepic} alt={site.site} style={{ width: '135px', height: '50px', objectFit: 'contain' }} />
                      <div style={{
                        textTransform: 'uppercase',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        margin: '10px 0'
                      }}>
                        {site.desc[0]}
                        <div><small style={{ fontWeight: '500', opacity: 0.5 }}>{site.desc[1]}</small></div>
                      </div>
                      <div style={{
                        background: site.color,
                        textAlign: 'center',
                        borderRadius: '30px',
                        height: '35px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        width: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '5px'
                      }}>
                        {site.button_text}
                      </div>
                    </a>
                    <div style={{
                      position: 'absolute',
                      right: '20px',
                      top: '25px',
                      width: '70px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                      color: site.color,
                      fontWeight: 'bold',
                      padding: '5px'
                    }}>
                      ⭐ VIP
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: '40px',
            display: 'flex',
            padding: '0 10px',
            width: '100%',
            justifyContent: 'space-between',
            fontSize: '11px'
          }}>
            <div style={{ color: '#fff' }}>
              {config.footer.licence_text}
            </div>
            <a
              href={config.footer.copyright_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#fff',
                opacity: 0.5,
                textDecoration: 'none'
              }}
            >
              {config.footer.copyright_text}
            </a>
          </div>
        </div>

        {/* Popup Banner */}
        {config.categories_control.show_popup_banner && config.popup_settings.enabled && (
          <div
            id="popup-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.75)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                (e.target as HTMLElement).style.display = 'none';
              }
            }}
          >
            <div style={{
              width: '300px',
              background: '#162160',
              borderRadius: '30px',
              padding: '20px',
              border: `1px solid ${config.sites.find(s => s.site === config.popup_settings.site_ref)?.color || '#ccc'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button
                onClick={() => {
                  const overlay = document.getElementById('popup-overlay');
                  if (overlay) overlay.style.display = 'none';
                }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
              <h3 style={{
                fontSize: '12px',
                margin: '10px 0 0',
                color: config.sites.find(s => s.site === config.popup_settings.site_ref)?.color || '#ccc'
              }}>
                {config.popup_settings.title}
              </h3>
              {config.popup_settings.site_ref && (
                <img
                  src={config.sites.find(s => s.site === config.popup_settings.site_ref)?.sitepic}
                  width="150"
                  alt="Site"
                  style={{ margin: '10px 0' }}
                />
              )}
              <h1 style={{
                fontSize: '18px',
                fontWeight: 900,
                margin: '5px 0',
                color: config.sites.find(s => s.site === config.popup_settings.site_ref)?.color || '#ccc'
              }}>
                {config.popup_settings.main_text}
              </h1>
              <small style={{
                marginBottom: '15px',
                opacity: 0.5,
                display: 'block'
              }}>
                {config.popup_settings.sub_text}
              </small>
              {config.popup_settings.site_ref && (
                <a
                  href={config.sites.find(s => s.site === config.popup_settings.site_ref)?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '7px',
                    width: '170px',
                    color: '#fff',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    textAlign: 'center',
                    borderRadius: '30px',
                    fontSize: '17px',
                    background: config.sites.find(s => s.site === config.popup_settings.site_ref)?.color || '#ccc',
                    display: 'block'
                  }}
                >
                  GİRİŞ YAP
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
