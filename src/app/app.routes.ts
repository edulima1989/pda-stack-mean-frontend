import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'empleados', pathMatch: 'full' },
  {
    path: 'empleados',
    loadComponent: () => import('./employees/employee-list/employee-list').then((m) => m.EmployeeList)
  },
  {
    path: 'empleados/nuevo',
    loadComponent: () => import('./employees/employee-form/employee-form').then((m) => m.EmployeeForm)
  },
  {
    path: 'empleados/:id/editar',
    loadComponent: () => import('./employees/employee-form/employee-form').then((m) => m.EmployeeForm)
  },
  { path: '**', redirectTo: 'empleados' }
];
