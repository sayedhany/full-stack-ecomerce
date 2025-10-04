import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminProductsComponent } from './pages/admin/admin-products/admin-products.component';
import { AdminCategoriesComponent } from './pages/admin/admin-categories/admin-categories.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public Routes with Language
  {
    path: 'en',
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'product/:slug',
        component: ProductDetailsComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      // Admin Routes (English)
      {
        path: 'admin/login',
        component: LoginComponent,
      },
      {
        path: 'admin/dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'products',
            pathMatch: 'full',
          },
          {
            path: 'products',
            component: AdminProductsComponent,
          },
          {
            path: 'categories',
            component: AdminCategoriesComponent,
          },
          {
            path: 'users',
            component: AdminUsersComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'ar',
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'product/:slug',
        component: ProductDetailsComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      // Admin Routes (Arabic)
      {
        path: 'admin/login',
        component: LoginComponent,
      },
      {
        path: 'admin/dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'products',
            pathMatch: 'full',
          },
          {
            path: 'products',
            component: AdminProductsComponent,
          },
          {
            path: 'categories',
            component: AdminCategoriesComponent,
          },
          {
            path: 'users',
            component: AdminUsersComponent,
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
