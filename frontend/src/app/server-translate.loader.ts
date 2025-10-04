import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { makeStateKey, StateKey, TransferState } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';

export class ServerTranslateLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private prefix: string = 'i18n',
    private suffix: string = '.json'
  ) {}

  public getTranslation(lang: string): Observable<any> {
    return new Observable((observer) => {
      try {
        // Try multiple possible paths
        const possiblePaths = [
          path.join(
            process.cwd(),
            'dist',
            'frontend',
            'browser',
            'assets',
            this.prefix
          ),
          path.join(process.cwd(), 'src', 'assets', this.prefix),
        ];

        let jsonData: any = null;
        let foundPath = false;

        for (const assetsFolder of possiblePaths) {
          const filePath = path.join(assetsFolder, `${lang}${this.suffix}`);
          if (fs.existsSync(filePath)) {
            jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            foundPath = true;
            console.log(`Translation file loaded from: ${filePath}`);
            break;
          }
        }

        if (!foundPath) {
          console.error(`Translation file not found for language: ${lang}`);
          console.error(`Tried paths:`, possiblePaths);
          observer.error(`Translation file not found for language: ${lang}`);
          return;
        }

        // Store the translation data in TransferState
        const key: StateKey<any> = makeStateKey<any>(
          `transfer-translate-${lang}`
        );
        this.transferState.set(key, jsonData);

        observer.next(jsonData);
        observer.complete();
      } catch (error) {
        console.error('Error loading translation:', error);
        observer.error(error);
      }
    });
  }
}
