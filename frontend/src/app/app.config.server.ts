import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';
import { TransferState } from '@angular/core';
import { appConfig } from './app.config';
import { ServerTranslateLoader } from './server-translate.loader';

// Factory function for server-side TranslateLoader
export function serverTranslateLoaderFactory(transferState: TransferState) {
  return new ServerTranslateLoader(transferState);
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: serverTranslateLoaderFactory,
          deps: [TransferState],
        },
      })
    ),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
