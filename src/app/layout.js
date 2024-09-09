
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
  title: 'Foodieful.net - Food truck finder',
  description: 'New food truck finder in town! Food truck vendors can list their locations and operating hours. Customers can search food truck locations by zip code.',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <title>Foodieful</title>

      <Script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/46942333.js" />

      <Script
        strategy="lazyOnload"
        type="text/javascript"
        id="yllix-script-loader"
        src="https://udbaa.com/bnr.php?section=General&pub=778719&format=300x250&ga=g" />
      {/* <noscript><a href="https://yllix.com/publishers/778719" target="_blank">
        <img src="//ylx-aff.advertica-cdn.com/pub/300x250.png"
          style="border:none;margin:0;padding:0;vertical-align:baseline;"
          alt="ylliX - Online Advertising Network" /></a></noscript> */}



      <body>
        <SessionProvider>
          <Suspense fallback={null}>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Menu />
                <Container disableGutters
                  sx={{ marginBottom: { xs: '20%', sm: '10%' }, marginTop: 4 }}
                >
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
