

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import Menu from "@/components/Menu";
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react';
import theme from '../theme';
import CssBaseline from '@mui/material/CssBaseline';
// import newrelic from 'newrelic'

export const metadata = {
  title: 'Foodieful.net',
  description: 'Food truck vendors can list their locations and operating hours.',
}

export default async function RootLayout({ children }) {
  // if (newrelic.agent.collector.isConnected() === false) {
  //   await new Promise((resolve) => {
  //     newrelic.agent.on("connected", resolve)
  //   })
  // }

  // const browserTimingHeader = newrelic.getBrowserTimingHeader({
  //   hasToRemoveScriptWrapper: true,
  //   allowTransactionlessInjection: true,
  // })
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
              {/* <Script
                // We have to set an id for inline scripts.
                // See https://nextjs.org/docs/app/building-your-application/optimizing/scripts#inline-scripts
                id="nr-browser-agent"
                // By setting the strategy to "beforeInteractive" we guarantee that
                // the script will be added to the document's `head` element.
                strategy="beforeInteractive"
                // The body of the script element comes from the async evaluation
                // of `getInitialProps`. We use the special
                // `dangerouslySetInnerHTML` to provide that element body. Since
                // it requires an object with an `__html` property, we pass in an
                // object literal.
                dangerouslySetInnerHTML={{ __html: browserTimingHeader }}
              /> */}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
