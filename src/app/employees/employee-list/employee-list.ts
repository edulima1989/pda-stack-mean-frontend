import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Employee } from '../employee.model';
import { EmployeeService, getErrorMessage } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './employee-list.html'
})
export class EmployeeList implements OnInit {
  private readonly service = inject(EmployeeService);

  readonly employees = signal<Employee[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  remove(employee: Employee): void {
    if (!confirm(`¿Eliminar a ${employee.nombre}?`)) {
      return;
    }
    this.service.delete(employee._id).subscribe({
      next: () => {
        this.employees.update((list) => list.filter((e) => e._id !== employee._id));
        this.success.set('Empleado eliminado');
      },
      error: (err) => this.error.set(getErrorMessage(err))
    });
  }
}
