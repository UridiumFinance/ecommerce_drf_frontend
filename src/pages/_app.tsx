import "@/styles/globals.css";
import "@/styles/slider.css";
import "@/styles/embla.css";

import { NextComponentType, NextPageContext } from "next";
import type { AppProps } from "next/app";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NProgress from "nprogress";
import "@/styles/nprogress.css";

import { ThemeProvider } from "next-themes";

import { Provider } from "react-redux";
import wrapper from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import Router from "next/router";

export type NextLayoutComponentType<P = {}> = NextComponentType<NextPageContext, any, P> & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

NProgress.configure({ showSpinner: false });

export default function App({ Component, pageProps }: AppProps) {
  const getLayout =
    (Component as NextLayoutComponentType).getLayout || ((page: React.ReactNode) => page);

  const { store, props } = wrapper.useWrappedStore(pageProps);

  // NProgress
  useEffect(() => {
    const handleRouteChangeStart = () => {
      NProgress.start();
    };

    const handleRouteChangeComplete = () => {
      NProgress.done();
    };

    const handleRouteChangeError = () => {
      NProgress.done();
    };

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={(store as any).persistor}>
        <ThemeProvider enableSystem defaultTheme="system" attribute="class">
          {getLayout(<Component {...props} />)}
          <ToastContainer className="bottom-0" position="bottom-right" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
