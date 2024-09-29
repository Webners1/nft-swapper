import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import { DrawersContainer } from '@/components/drawer-views/container';
import { ToastContainer } from 'react-toastify';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';
import './flags.css';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from '@/lib/hooks/use-connect';
import 'overlayscrollbars/css/OverlayScrollbars.css';
// base css file
import 'swiper/css';
import '@/assets/css/scrollbar.css';
import '@/assets/css/globals.css';
import '@/assets/css/range-slider.css';
import { ModalContainer } from '@/components/modal-views/container';
import React, { FC } from 'react';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const CustomApp: FC<AppProps> = ({
  Component,
  pageProps,
}: AppPropsWithLayout) => {
  //could remove this if you don't need to page level layout
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        {/* maximum-scale 1 meta tag need to prevent ios input focus auto zooming */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <title>NFTSwapper</title>
        <link
          href="https://fonts.googleapis.com/css?family=Manrope"
          rel="stylesheet"
        ></link>
      </Head>
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <ToastContainer />
        <WalletProvider>
          <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
            {getLayout(<Component {...pageProps} />)}
            {/*<SettingsButton />*/}
            {/*<SettingsDrawer />*/}
            <ModalContainer />
            <DrawersContainer />
          </PrimeReactProvider>
        </WalletProvider>
      </ThemeProvider>
    </>
  );
};

export default CustomApp;
