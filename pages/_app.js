import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from '../src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import { SidebarProvider } from '../src/contexts/SidebarContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { StylesProvider } from '@material-ui/core/styles';
import { SITETITLE } from '../utils/constant';

const clientSideEmotionCache = createEmotionCache();

// Styles import
import '../styles/globals.css';

function CmsApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  return (
    <StylesProvider generateClassName={(rule, sheet) => `${sheet.options.classNamePrefix}-${rule.key}`}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{SITETITLE}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <SidebarProvider>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />

              {getLayout(<Component {...pageProps} />)}

            </LocalizationProvider>
          </ThemeProvider>
        </SidebarProvider>
      </CacheProvider>
    </StylesProvider>
  );
}

export default CmsApp;
