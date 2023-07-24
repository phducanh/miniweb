import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from 'redux/store'
import 'styles/global.scss'
import { ErrorBoundary } from 'react-error-boundary'
import { appWithTranslation } from 'next-i18next'
import { ApolloProvider } from '@apollo/client'
import client from 'apollo-setting'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Save Day</title>
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1.0, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="description" content="Save Day" />
        <meta name="keywords" content="Save Day" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Provider>
      </ErrorBoundary>
    </>
  )
}

export default appWithTranslation(MyApp)
