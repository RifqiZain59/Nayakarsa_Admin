import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Nayakarsa Admin Panel',
  description: 'Panel administrasi Nayakarsa - kelola jadwal, barcode, dan data rekap',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable} style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
