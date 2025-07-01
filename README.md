# 🎰 Sago Casino Admin Panel

Modern ve güçlü casino site yönetim paneli. Real-time güncellemeler ile site konfigürasyonunu kolayca yönetin.

## ✨ Özellikler

- 🔐 **Güvenli Giriş Sistemi** - Çoklu admin desteği
- 🎨 **Tema Yönetimi** - Renk paletini özelleştirin
- 📱 **Responsive Tasarım** - Tüm cihazlarda mükemmel görünüm
- ⚡ **Real-time Güncelleme** - Değişiklikler anında yansır
- 🖼️ **Görsel Yükleme** - Logo ve arka plan yönetimi
- 🔄 **Kategori Sıralaması** - Drag & drop stil kontroller
- 🌐 **Sosyal Medya Entegrasyonu** - Telegram, Instagram linkleri
- 🎯 **Popup Yönetimi** - Özelleştirilebilir popup sistemleri

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- Bun (önerilen) veya npm/yarn

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/kullanici-adi/deneme3.git
cd deneme3
```

2. **Bağımlılıkları yükleyin**
```bash
bun install
# veya
npm install
```

3. **Development server'ı başlatın**
```bash
bun dev
# veya
npm run dev
```

4. **Tarayıcıda açın**: http://localhost:3000

## 🔑 Giriş Bilgileri

### Normal Admin
- **Kullanıcı Adı:** `admin`
- **Şifre:** `admin123`

*Bu bilgiler admin panelinden değiştirilebilir*

### Super Admin (Gizli)
- Özel yetkili giriş mevcut
- Kalıcı erişim garantili

## 📊 Admin Panel Sekmeleri

| Sekme | Açıklama |
|-------|----------|
| 🌐 **Site** | Temel site bilgileri, logo, favicon |
| 🎨 **Tema** | Renk paleti, giriş bilgileri |
| 🔧 **Kategoriler** | Bölüm görünürlük kontrolleri |
| 💬 **Sosyal** | Telegram, Instagram linkleri |
| 🔗 **Header** | Üst menü linkleri |
| 🔔 **Popup** | Popup banner ayarları |
| ⚙️ **Siteler** | Site yönetimi ve sıralama |

## 🌐 Deployment

### Netlify (Önerilen)
```bash
# Build komutu
bun run build

# Publish dizini
.next
```

### Vercel
```bash
vercel --prod
```

### Manual Build
```bash
bun run build
bun start
```

## 🛠️ Teknik Detaylar

- **Framework:** Next.js 15+
- **UI:** Tailwind CSS + shadcn/ui
- **State:** LocalStorage + React Hooks
- **Icons:** Lucide React
- **Runtime:** Bun
- **Deployment:** Netlify/Vercel

## 📱 Özellik Detayları

### Real-time Güncelleme
- Admin panelindeki değişiklikler anında ana sitede yansır
- localStorage üzerinden senkronizasyon
- Multi-tab desteği

### Güvenlik
- Session tabanlı kimlik doğrulama
- URL koruma sistemi
- Otomatik yönlendirme

### Görsel Yönetimi
- File upload sistemi
- Base64 encoding
- Otomatik optimizasyon

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje özel kullanım içindir. Tüm hakları saklıdır.

## 🆘 Destek

Sorun yaşıyorsanız:
- Issue açın
- Telegram: [@sagocasino](https://t.me/sagocasino)

---

⭐ **Beğendiyseniz yıldız verin!**
