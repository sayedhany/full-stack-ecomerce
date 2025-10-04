import {
  Component,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/product.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,

  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

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

  // Reactive Form
  productForm!: FormGroup;

  // File upload
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadCategories();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name_en: ['', Validators.required],
      name_ar: ['', Validators.required],
      description_en: ['', Validators.required],
      description_ar: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
    });
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
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.reset({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      price: 0,
      category: '',
    });
    this.showModal.set(true);
  }

  openEditModal(product: Product): void {
    this.editingProduct.set(product);
    this.selectedFile = null;
    this.imagePreview = product.image; // Show existing image
    this.productForm.patchValue({
      name_en: product.name.en,
      name_ar: product.name.ar,
      description_en: product.description.en,
      description_ar: product.description.ar,
      price: product.price,
      category:
        typeof product.category === 'string'
          ? product.category
          : product.category._id,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingProduct.set(null);
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.reset();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    // Check if image is required for new products
    const editing = this.editingProduct();
    if (!editing && !this.selectedFile) {
      alert('Please select an image for the product');
      return;
    }

    const formValue = this.productForm.value;

    // Generate slugs from names
    const slugEn = this.generateSlug(formValue.name_en);
    const slugAr = this.generateSlug(formValue.name_ar);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name_en', formValue.name_en);
    formData.append('name_ar', formValue.name_ar);
    formData.append('description_en', formValue.description_en);
    formData.append('description_ar', formValue.description_ar);
    formData.append('price', formValue.price.toString());
    formData.append('category', formValue.category);
    formData.append('slug_en', slugEn);
    formData.append('slug_ar', slugAr);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (editing) {
      this.productService
        .updateProductWithImage(editing._id, formData)
        .subscribe({
          next: () => {
            this.loadProducts(this.currentPage());
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating product:', err);
            alert('Error updating product. Please try again.');
          },
        });
    } else {
      this.productService.createProductWithImage(formData).subscribe({
        next: () => {
          this.loadProducts(1);
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating product:', err);
          alert('Error creating product. Please try again.');
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

  getCategoryName(product: Product): string {
    if (!product.category) return '';
    return typeof product.category === 'string' ? '' : product.category.name.en;
  }

  onPageChange(page: number): void {
    this.loadProducts(page);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private generateSlug(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\u0600-\u06FFa-z0-9\-]/g, '') // Remove invalid chars (keep Arabic, English, numbers, and -)
      .replace(/-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start
      .replace(/-+$/, ''); // Trim - from end
  }
}
