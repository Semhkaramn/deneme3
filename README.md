# Sago Casino Admin Panel

Bu proje, casino sitelerinin konfigürasyonunu yönetmek için geliştirilmiş modern bir admin paneli ve site önizleme sistemidir.

## 🚀 Özellikler

- **📱 Responsive Admin Panel** - Tüm cihazlarda mükemmel çalışır
- **🎨 Real-time Preview** - Değişiklikleri anında önizleme
- **🔄 Export/Import Sistem** - Konfigürasyonları tarayıcılar arası aktarım
- **☁️ Cloud Sync** - Supabase ile bulut senkronizasyonu
- **🎯 Site Yönetimi** - Unlimited site ekleme ve kategori düzenleme
- **🎭 Tema Düzenleme** - Özelleştirilebilir renk şeması
- **📊 Analytics Ready** - Gelecek güncellemeler için analitik altyapısı

## 🛠️ Kurulum

### 1. Projeyi Klonlayın
```bash
git clone <repo-url>
cd sago-casino-admin
bun install
```

### 2. Development Server'ı Başlatın
```bash
bun dev
```

### 3. Admin Paneli Erişimi
- URL: `http://localhost:3000/admin`
- Kullanıcı Adı: `admin`
- Şifre: `admin123`

## ☁️ Cloud Sync Kurulumu (Opsiyonel)

Cloud sync özelliği, konfigürasyonlarınızı bulutta saklayıp farklı cihazlar arasında paylaşmanızı sağlar.

### Supabase Kurulumu

1. **Supabase Hesabı Oluşturun**
   - [supabase.com](https://supabase.com) adresinde ücretsiz hesap açın
   - Yeni proje oluşturun

2. **Database Tablosu Oluşturun**
   Supabase SQL Editor'da şu komutu çalıştırın:
   ```sql
   CREATE TABLE configurations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     share_code VARCHAR(10) UNIQUE NOT NULL,
     configuration JSONB NOT NULL,
     description TEXT,
     access_count INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE INDEX idx_configurations_share_code ON configurations(share_code);
   ```

3. **Environment Variables**
   `.env.local` dosyasını düzenleyin:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **RLS (Row Level Security) - Opsiyonel**
   Güvenlik için RLS politikaları ekleyebilirsiniz:
   ```sql
   ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow read access" ON configurations
   FOR SELECT USING (true);

   CREATE POLICY "Allow insert access" ON configurations
   FOR INSERT WITH CHECK (true);
   ```

### Netlify Deployment için Cloud Sync

1. **Netlify Dashboard'da Environment Variables**
   - Site Settings > Environment variables
   - `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` ekleyin

2. **Build Settings**
   - Build command: `bun run build`
   - Publish directory: `.next`

## 📋 Kullanım

### Admin Panel Sekmeler

1. **Site Config** - Temel site bilgileri (logo, favicon, title)
2. **Tema** - Renk şeması düzenleme
3. **Kategoriler** - Hangi bölümlerin aktif olacağı
4. **Sosyal** - Sosyal medya linkleri
5. **Header** - Header linkleri ve ikonlar
6. **Popup** - Popup banner ayarları
7. **Siteler** - Site ekleme, düzenleme ve kategori sıralaması
8. **Yedek** - Export/import ve cloud sync

### Cloud Sync Kullanımı

1. **Ayarları Cloud'a Yükleme**
   - Yedek sekmesine gidin
   - "Cloud'a Yükle" butonuna basın
   - Aldığınız 6 haneli kodu saklayın

2. **Ayarları Başka Cihazda İndirme**
   - Diğer cihazda admin panelini açın
   - Yedek sekmesinde share code'u girin
   - "Cloud'dan İndir" butonuna basın

### Tarayıcılar Arası Aktarım

Cloud sync kullanmıyorsanız:

1. **Export**: "Dışa Aktar" > "Panoya Kopyala" veya "Dosya İndir"
2. **Import**: Diğer tarayıcıda "İçe Aktar" bölümüne yapıştırın

## 🔧 Konfigürasyon

### Site Limitleri

Bazı kategorilerde limit vardır:
- Sol/Sağ Sabit Banner: Her birine 1 site
- Animasyonlu Hover: 4 site
- Diğer kategoriler: Sınırsız

### Dosya Yükleme

- Desteklenen formatlar: JPG, PNG, GIF, SVG, ICO
- Otomatik color extraction logo'dan
- Base64 encoding ile saklama

### Auto-logout

- Varsayılan: 30 dakika inaktivite
- Ayarlanabilir admin settings'den
- Countdown timer ile uyarı

## 📱 Responsive Design

- **Desktop**: Tam featured panel
- **Tablet**: Optimized layout
- **Mobile**: Touch-friendly interface

## 🔒 Güvenlik

- localStorage ile client-side saklama
- Supabase RLS ile güvenli cloud storage
- Environment variables ile API key koruması
- Admin credentials localStorage'da

## 🚀 Deployment

### Netlify (Önerilen)

1. GitHub repo'ya push edin
2. Netlify'da site oluşturun
3. Environment variables ekleyin
4. Auto-deploy aktif

### Diğer Platformlar

- Vercel, Railway, Heroku uyumlu
- Static export destekli
- Next.js 15+ gereksinimleri

## 🆘 Sorun Giderme

### Cloud Sync Çalışmıyor
- Supabase URL/Key kontrol edin
- Console'da error mesajlarına bakın
- Database tablosunun oluşturulduğundan emin olun

### LocalStorage Silinirse
- Export/import kullanın
- Cloud sync varsa share code ile geri yükleyin
- Reset butonu ile defaults'a dönün

### Performance
- Görseller otomatik optimize edilir
- Lazy loading aktif
- Minimal bundle size

## 📄 Lisans

MIT License - Kendi projelerinizde özgürce kullanabilirsiniz.

## 🤝 Katkıda Bulunma

Pull request'ler ve issue'lar hoş karşılanır!

---

**Sago Casino Admin Panel** - Modern, güvenli ve kullanıcı dostu casino site yönetimi.
