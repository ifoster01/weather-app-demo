import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/general/navbar';
import QueryClientContext from './QueryClientProvider';

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
