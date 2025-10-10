import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/translation.service';
import { CONTACT_INFO } from '../../config/contact.config';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private languageService = inject(LanguageService);

  currentYear = new Date().getFullYear();
  contactInfo = CONTACT_INFO;

  get currentLang(): string {
    return this.languageService.getCurrentLanguage();
  }
}
