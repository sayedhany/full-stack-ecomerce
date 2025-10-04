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
import { UserService } from '../../../services/user.service';
import { User } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

  users = signal<User[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingUser = signal<User | null>(null);

  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalUsers = signal(0);
  itemsPerPage = 10;

  userForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['customer', [Validators.required]],
    });
  }

  loadUsers(page: number = 1): void {
    this.loading.set(true);
    this.userService.getUsers(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.totalPages.set(response.pages || 1);
        this.totalUsers.set(response.total || 0);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  openAddModal(): void {
    this.editingUser.set(null);
    this.userForm.reset({
      name: '',
      email: '',
      password: '',
      role: 'customer',
    });
    // Make password required for new users
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  openEditModal(user: User): void {
    this.editingUser.set(user);
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    // Make password optional for editing
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingUser.set(null);
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.userForm.value;
    const userData: any = {
      name: formValue.name,
      email: formValue.email,
      role: formValue.role,
    };

    // Only include password if it's set
    if (formValue.password) {
      userData.password = formValue.password;
    }

    const editing = this.editingUser();
    if (editing) {
      this.userService.updateUser(editing._id, userData).subscribe({
        next: () => {
          this.loadUsers(this.currentPage());
          this.closeModal();
        },
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.loadUsers(1);
          this.closeModal();
        },
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers(this.currentPage());
        },
      });
    }
  }

  onPageChange(page: number): void {
    this.loadUsers(page);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
