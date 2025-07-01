'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ArrowRight, Monitor } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to admin after 3 seconds
    const timer = setTimeout(() => {
      router.push('/admin');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <CardTitle className="text-2xl text-white">
              Sago Casino Admin Panel
            </CardTitle>
            <CardDescription className="text-gray-300">
              Site konfigürasyonunuzu kolayca yönetin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Admin paneline yönlendiriliyorsunuz...
              </p>

              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"
                  style={{
                    animation: 'progress 3s linear forwards'
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/admin')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Paneline Git
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                onClick={() => window.open('/preview', '_blank')}
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-700"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Site Önizlemesi
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Sago Casino Admin Panel v1.0
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
