import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import bootstrap from './src/main.server';
import { LOCALE_ID } from '@angular/core';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser (this must come before the SSR handler)
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
    })
  );

  // Debug middleware to log requests
  server.use((req, res, next) => {
    console.log(`[DEBUG] Request for: ${req.path}, Method: ${req.method}`);
    next();
  });

  // Redirect root to default language
  server.get('/', (req, res) => {
    // Check if user has a language preference in cookie
    const cookieLang = req.cookies ? req.cookies['app-language'] : null;
    const defaultLang = ['en', 'ar'].includes(cookieLang) ? cookieLang : 'en';
    console.log(`[DEBUG] Redirecting / to /${defaultLang}`);
    res.redirect(302, `/${defaultLang}`);
  });

  // SSR handler for all routes (only for HTML routes, not static assets)
  server.get('*', (req, res, next) => {
    // Skip if this is a request for a static asset (has file extension)
    const isStaticAsset = req.path.match(
      /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map|json)$/
    );
    if (isStaticAsset) {
      console.log(`[DEBUG] Skipping SSR for static asset: ${req.path}`);
      return next();
    }

    console.log(`[DEBUG] Processing SSR for: ${req.path}`);
    const { protocol, originalUrl, headers } = req;

    // Use the original URL for Angular routing
    const relativeUrl = originalUrl || '/';

    // Detect language from URL path or cookie
    const urlSegments = relativeUrl.split('/').filter((s) => s);
    const langSegment = urlSegments[0];
    const supportedLanguages = ['en', 'ar'];

    let locale = 'en-US';
    let language = 'en';

    // Check URL first, then cookie, then default
    if (supportedLanguages.includes(langSegment)) {
      language = langSegment;
      locale = langSegment === 'ar' ? 'ar-SA' : 'en-US';
    } else {
      // Check cookie if no language in URL
      const cookieLang = req.cookies['app-language'];
      if (supportedLanguages.includes(cookieLang)) {
        language = cookieLang;
        locale = cookieLang === 'ar' ? 'ar-SA' : 'en-US';
      }
    }

    console.log(
      `SSR: Rendering ${originalUrl} with locale: ${locale}, language: ${language}`
    );

    // Load translations for SSR
    let translations: Record<string, unknown> = {};
    try {
      const translationPath = join(
        browserDistFolder,
        'assets',
        'i18n',
        `${language}.json`
      );
      const fileContent = readFileSync(translationPath, 'utf8');
      translations = JSON.parse(fileContent);
      console.log(
        `Loaded translations for ${language}:`,
        Object.keys(translations)
      );
    } catch (error) {
      console.warn(`Error loading translations for ${language}:`, error);
    }

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${relativeUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: LOCALE_ID, useValue: locale },
          { provide: 'TRANSLATIONS', useValue: translations },
          { provide: 'CURRENT_LANGUAGE', useValue: language },
        ],
      })
      .then((html) => {
        // Set <html lang="..." dir="...">
        if (language === 'ar') {
          html = html.replace('<html', '<html lang="ar" dir="rtl"');
        } else {
          html = html.replace('<html', '<html lang="en" dir="ltr"');
        }

        res.send(html);
      })
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
