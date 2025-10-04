import {
  Component,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/product.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,

  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private platformId = inject(PLATFORM_ID);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingProduct = signal<Product | null>(null);

  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalProducts = signal(0);
  itemsPerPage = 10;

  // Form
  formData = {
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    price: 0,
    image: '',
    category: '',
  };

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(page: number = 1): void {
    this.loading.set(true);
    this.productService.getProducts(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.totalPages.set(response.pages || 1);
        this.totalProducts.set(response.total || 0);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.data);
      },
    });
  }

  openAddModal(): void {
    this.editingProduct.set(null);
    this.formData = {
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      price: 0,
      image: '',
      category: '',
    };
    this.showModal.set(true);
  }

  openEditModal(product: Product): void {
    this.editingProduct.set(product);
    this.formData = {
      name_en: product.name.en,
      name_ar: product.name.ar,
      description_en: product.description.en,
      description_ar: product.description.ar,
      price: product.price,
      image: product.image,
      category:
        typeof product.category === 'string'
          ? product.category
          : product.category._id,
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingProduct.set(null);
  }

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const formValue = this.formData;
    const productData = {
      name: {
        en: formValue.name_en,
        ar: formValue.name_ar,
      },
      description: {
        en: formValue.description_en,
        ar: formValue.description_ar,
      },
      price: formValue.price,
      image: formValue.image,
      category: formValue.category,
    };

    const editing = this.editingProduct();
    if (editing) {
      this.productService.updateProduct(editing._id, productData).subscribe({
        next: () => {
          this.loadProducts(this.currentPage());
          this.closeModal();
        },
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts(1);
          this.closeModal();
        },
      });
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(this.currentPage());
        },
      });
    }
  }

  onPageChange(page: number): void {
    this.loadProducts(page);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
