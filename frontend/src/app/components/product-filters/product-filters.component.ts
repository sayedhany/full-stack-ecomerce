import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss',
})
export class ProductFiltersComponent {
  // Inputs
  searchTerm = input<string>('');
  selectedCategory = input<string>('');
  categories = input<Category[]>([]);
  currentLang = input<string>('en');

  // Outputs
  searchChange = output<string>();
  categoryChange = output<string>();

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.categoryChange.emit(target.value);
  }

  getLocalizedName(category: Category): string {
    const lang = this.currentLang();
    return category.name[lang as 'en' | 'ar'] || category.name.en;
  }
}
