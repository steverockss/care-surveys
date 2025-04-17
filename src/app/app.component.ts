// src/app/app.component.ts
import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterModule],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-3">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
