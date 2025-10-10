import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [CommonModule, TranslateModule, ProductCardComponent],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.scss',
})
export class ProductsGridComponent {
  // Inputs
  products = input<Product[]>([]);
  loading = input<boolean>(false);
  currentPage = input<number>(1);
  totalPages = input<number>(1);
  totalProducts = input<number>(0);
  itemsPerPage = input<number>(12);
  currentLang = input<string>('en');

  // Outputs
  pageChange = output<number>();

  // Math for template
  Math = Math;

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  getPaginationArray(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push(-1, total);
    } else if (total > 1) {
      rangeWithDots.push(total);
    }

    return rangeWithDots;
  }
}
