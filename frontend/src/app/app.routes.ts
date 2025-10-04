import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  // Public Routes with Language
  {
    path: 'en',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'product/:slug',
        loadComponent: () =>
          import('./pages/product-details/product-details.component').then(
            (m) => m.ProductDetailsComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
    ],
  },
  // Admin Routes (English)
  {
    path: 'en/admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/admin/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'products',
            pathMatch: 'full',
          },
          {
            path: 'products',
            loadComponent: () =>
              import(
                './pages/admin/admin-products/admin-products.component'
              ).then((m) => m.AdminProductsComponent),
          },
          {
            path: 'categories',
            loadComponent: () =>
              import(
                './pages/admin/admin-categories/admin-categories.component'
              ).then((m) => m.AdminCategoriesComponent),
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/admin-users/admin-users.component').then(
                (m) => m.AdminUsersComponent
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'ar',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'product/:slug',
        loadComponent: () =>
          import('./pages/product-details/product-details.component').then(
            (m) => m.ProductDetailsComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
    ],
  },
  // Admin Routes (Arabic)
  {
    path: 'ar/admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/admin/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'products',
            pathMatch: 'full',
          },
          {
            path: 'products',
            loadComponent: () =>
              import(
                './pages/admin/admin-products/admin-products.component'
              ).then((m) => m.AdminProductsComponent),
          },
          {
            path: 'categories',
            loadComponent: () =>
              import(
                './pages/admin/admin-categories/admin-categories.component'
              ).then((m) => m.AdminCategoriesComponent),
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/admin-users/admin-users.component').then(
                (m) => m.AdminUsersComponent
              ),
          },
        ],
      },
    ],
  },
  {
    path: '',
    redirectTo: '/en',
    pathMatch: 'full',
  },
];
