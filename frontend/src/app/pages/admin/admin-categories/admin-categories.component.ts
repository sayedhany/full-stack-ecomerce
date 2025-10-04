import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/product.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss',
})
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingCategory = signal<Category | null>(null);

  formData = {
    name_en: '',
    name_ar: '',
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  openAddModal(): void {
    this.editingCategory.set(null);
    this.formData = {
      name_en: '',
      name_ar: '',
    };
    this.showModal.set(true);
  }

  openEditModal(category: Category): void {
    this.editingCategory.set(category);
    this.formData = {
      name_en: category.name.en,
      name_ar: category.name.ar,
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingCategory.set(null);
  }

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const formValue = this.formData;
    const categoryData = {
      name: {
        en: formValue.name_en,
        ar: formValue.name_ar,
      },
    };

    const editing = this.editingCategory();
    if (editing) {
      this.categoryService.updateCategory(editing._id, categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
      });
    }
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
      });
    }
  }
}
