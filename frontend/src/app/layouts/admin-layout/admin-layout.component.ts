import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="admin-layout">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .admin-layout {
        min-height: 100vh;
        background-color: #f5f7fa;
      }
    `,
  ],
})
export class AdminLayoutComponent {}
