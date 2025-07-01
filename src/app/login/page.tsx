'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lock, User, Shield, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  // Sabit admin logo
  const adminLogo = 'https://i.hizliresim.com/ccqzxp2.png';
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Super admin kontrolü (gizli giriş)
    if (credentials.username === 'semhkaraman' && credentials.password === 'Abuzittin74') {
      localStorage.setItem('admin-authenticated', 'true');
      toast.success('Super Admin girişi başarılı!');
      router.push('/admin');
      return;
    }

    // Normal admin kontrolü (localStorage'dan al)
    const savedUsername = localStorage.getItem('admin-username') || 'admin';
    const savedPassword = localStorage.getItem('admin-password') || 'admin123';

    if (credentials.username === savedUsername && credentials.password === savedPassword) {
      localStorage.setItem('admin-authenticated', 'true');
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      router.push('/admin');
    } else {
      toast.error('Kullanıcı adı veya şifre hatalı!');
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">

        {/* Logo Section */}
        <div className="text-center">
          {adminLogo ? (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-slate-800 border-4 border-slate-600">
              <img
                src={adminLogo}
                alt="Admin Logo"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" />
            </div>
          )}
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-300">
            Güvenli giriş yapın
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Giriş Yap</CardTitle>
            <CardDescription className="text-gray-300">
              Admin paneline erişim için giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Kullanıcı Adı
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Kullanıcı adınızı girin"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Şifrenizi girin"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Shield className="w-4 h-4 mr-2" />
                Giriş Yap
              </Button>
            </form>
          </CardContent>
        </Card>



      </div>
    </div>
  );
}
