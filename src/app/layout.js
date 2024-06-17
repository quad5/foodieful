import "./globals.css";
import { inter } from '@/app/ui/fonts';
import Menu from "@/components/Menu/Menu";
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <title>Foodieful</title>
        
        
        <body className={`${inter.className} antialiased`}>
          <SessionProvider>
            <Menu/>
            {children}
          </SessionProvider>
        </body>
        
        
        
    </html>
  );
}
