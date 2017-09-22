import { unescapeHTML } from '../../utils/text';
import { getProjectConfig } from 'config';
import readJson from 'read-package-json';

// Read version from package.json
let bundleVersion;
readJson(__dirname + '/../../../package.json', console.error, false, (err, data) => {
  bundleVersion = data.version;
});

const escapeSymbolsForStringify = text => {
  return text.replace(/\u2028/g, '').replace(/\u2029/g, '');
};

export const renderFullPage = (html, domain, projectName, manifestMain, manifestChunk, initialState = null, head, ssrEnabled = false) => {
  let htmlLang = 'ru';
  const userState = (initialState || {}).user || {};
  if (userState.user && userState.user.language && userState.user.language === 'en') {
    htmlLang = 'en';
  }

  const manifestMainScript = (manifestMain
      ? manifestMain['main.js']
      : `prj_${projectName}.js`) + `?v=${bundleVersion}`;
  const manifestMainCss = `common.css?v=${bundleVersion}`;
  const manifestProjectCss = (manifestMain ? manifestMain['main.css'] : `${projectName}.css`) + `?v=${bundleVersion}`;

  const bundleCSS = ssrEnabled
    ? `<link rel="stylesheet" type="text/css" href="/dist/${manifestMainCss}"></style><link rel="stylesheet" type="text/css" href="/dist/${manifestProjectCss}"></style>`
    : '';

  const initialStateStringify = escapeSymbolsForStringify(JSON.stringify(initialState));

  const manifestChunkScript = manifestChunk ? `
    <script>
      //<![CDATA[
      window.webpackManifest = ${JSON.stringify(manifestChunk)}
      //]]>
    </script>
  ` : '';

  const favicon = getProjectConfig().favicon ?
    `<link rel="shortcut icon" href="${getProjectConfig().favicon}" type="image/x-icon">` : '';


  return `<!doctype html>
    <html lang="${htmlLang}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1.0, minimum-scale=1.0, maximum-scale=1.0">
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${head ? head.url : ''}" />
        <meta property="fb:app_id" content="${getProjectConfig().facebookAppId}" />
        <meta property="fb:pages" content="${getProjectConfig().META_FB_PAGES}" />

        ${head ? unescapeHTML(head.title) : ''}
        ${head ? unescapeHTML(head.meta) : ''}

        ${bundleCSS}
        ${favicon}        
        <link rel="apple-touch-icon" sizes="57x57" href="/static/favicon/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/static/favicon/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/static/favicon/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/static/favicon/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/static/favicon/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/static/favicon/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/static/favicon/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/static/favicon/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="/static/favicon/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/static/favicon/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png">
        <link rel="manifest" href="/manifest.json">
        
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff">
        ${manifestChunkScript}
        ${fbPixel} 

      </head>
      <body>
        <div id="root">${html ? html : ''}</div>
        <div id="uploadcare-vendor"></div>
        <div id="google-plus-vendor"></div>
        <div id="vk_api_transport"></div>

        <script>
          window.__INITIAL_STATE__ = ${initialStateStringify};
        </script>

        <script src="/static/vendors/index.js?v=${bundleVersion}" charset="utf-8"></script>
           
        <script src="/dist/${manifestMainScript}"></script>                
      </body>
    </html>
    `;
};
