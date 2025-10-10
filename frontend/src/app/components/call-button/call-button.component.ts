import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { getAllPhones } from '../../config/contact.config';

@Component({
  selector: 'app-call-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './call-button.component.html',
  styleUrl: './call-button.component.scss',
})
export class CallButtonComponent {
  isMenuOpen = signal(false);

  phoneNumbers = getAllPhones();

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  callNumber(tel: string): void {
    window.location.href = `tel:${tel}`;
    this.closeMenu();
  }
}
