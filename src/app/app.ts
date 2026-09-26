import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <div class="container topbar-inner">
        <a routerLink="/empleados" class="brand">Gestión de empleados</a>
      </div>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: `
    .topbar { background: #24292f; color: #fff; }
    .topbar-inner { padding-top: 1rem; padding-bottom: 1rem; }
    .brand { color: #fff; text-decoration: none; font-weight: 700; font-size: 1.2rem; }
  `
})
export class App {}
