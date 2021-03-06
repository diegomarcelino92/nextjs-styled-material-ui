import React, { Children } from 'react';

import Document, { Html, Head, Main, NextScript } from 'next/document';

import { ServerStyleSheets } from '@material-ui/core/styles';
import { ServerStyleSheet } from 'styled-components';

import theme from '../src/configuration/theme';

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

CustomDocument.getInitialProps = async (ctx) => {
  const materialSheets = new ServerStyleSheets();
  const styledSheets = new ServerStyleSheet();

  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        styledSheets.collectStyles(materialSheets.collect(<App {...props} />)),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      ...Children.toArray(initialProps.styles),
      materialSheets.getStyleElement(),
      styledSheets.getStyleElement(),
    ],
  };
};
