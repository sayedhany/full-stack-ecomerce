import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
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
    ],
  },
  {
    path: '',
    redirectTo: '/en',
    pathMatch: 'full',
  },
];
