import React from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, { Head, Html, Main, NextScript } from "next/document";

const MyDocument = () => {
  const gtmEnabled = process.env.NEXT_PUBLIC_ENABLE_GTM === "true";
  const smartsuppEnabled =
    process.env.NEXT_PUBLIC_ENABLE_SMARTSUPP === "true";
  const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY || "";
  return (
    <Html lang="en">
      <Head>
        {gtmEnabled && (
          <>
            {/* Google Tag Manager */}
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MVHQKLZT');`,
              }}
            />
            {/* End Google Tag Manager */}
          </>
        )}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        {gtmEnabled && (
          <>
            {/* Google Tag Manager (noscript) */}
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-MVHQKLZT"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
            {/* End Google Tag Manager (noscript) */}
          </>
        )}
        <Main />
        <NextScript />

        {/* Smartsupp Live Chat */}
        {smartsuppEnabled && smartsuppKey && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  var _smartsupp = _smartsupp || {};
                  _smartsupp.key = '${smartsuppKey}';
                  window.smartsupp || (function(d) {
                    var s, c, o = smartsupp = function() { o._.push(arguments) };
                    o._ = [];
                    s = d.getElementsByTagName('script')[0];
                    c = d.createElement('script');
                    c.type = 'text/javascript';
                    c.charset = 'utf-8';
                    c.async = true;
                    c.src = 'https://www.smartsuppchat.com/loader.js?';
                    s.parentNode.insertBefore(c, s);
                  })(document);
                `,
              }}
            />
            <noscript>
              Powered by{" "}
              <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">
                Smartsupp
              </a>
            </noscript>
          </>
        )}
        {/* End Smartsupp Live Chat */}
      </body>
    </Html>
  );
};

MyDocument.getInitialProps = async (ctx) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);

  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
