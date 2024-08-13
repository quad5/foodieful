// import 'newrelic'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import Menu from "@/components/Menu";
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react';
import theme from '../theme';
import CssBaseline from '@mui/material/CssBaseline';

export const metadata = {
  title: 'Foodieful.net',
  description: 'Food truck vendors can list their locations and operating hours.',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <title>Foodieful</title>

      <Script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/46942333.js" />

      <body>
        <SessionProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Menu />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
