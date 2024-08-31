
import { Suspense } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material'
import Menu from "@/components/Menu";
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react';
import theme from '../theme';
import CssBaseline from '@mui/material/CssBaseline';

export const metadata = {
  title: 'Foodieful.net',
  description: 'New food truck finder in town! Food truck vendors can list their locations and operating hours. Customers can search food truck locations by zip code.',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <title>Foodieful</title>

      <Script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/46942333.js" />

      <body>
        <SessionProvider>
          <Suspense fallback={null}>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Menu />
                <Container disableGutters>
                  {children}
                </Container>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  );
}
