import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/general/navbar';
import QueryClientContext from './QueryClientProvider';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Weather.io',
  description:
    'Weather.io is a weather app that allows you to search for weather information for a specific location.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, 'clarity', 'script', 'rqc5pr9cxr');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          <QueryClientContext>
            <Navbar />
            {children}
          </QueryClientContext>
        </main>
      </body>
    </html>
  );
}
