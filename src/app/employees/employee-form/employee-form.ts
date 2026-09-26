import { Component, OnInit, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService, getErrorMessage } from '../employee.service';
import { EmployeeInput } from '../employee.model';

const notBlank = Validators.pattern(/\S/);

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.html'
})
export class EmployeeForm implements OnInit {
  private readonly service = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  /** Route param bound via withComponentInputBinding. */
  readonly id = input<string>();

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, notBlank]],
    cargo: ['', [Validators.required, notBlank]],
    departamento: ['', [Validators.required, notBlank]],
    sueldo: [0, [Validators.required, Validators.min(0.01)]]
  });

  get isEdit(): boolean {
    return !!this.id();
  }

  ngOnInit(): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: ({ nombre, cargo, departamento, sueldo }) => {
        this.form.setValue({ nombre, cargo, departamento, sueldo });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  isInvalid(field: keyof EmployeeInput): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: EmployeeInput = {
      nombre: raw.nombre.trim(),
      cargo: raw.cargo.trim(),
      departamento: raw.departamento.trim(),
      sueldo: Number(raw.sueldo)
    };

    const id = this.id();
    const request$: Observable<unknown> = id ? this.service.update(id, payload) : this.service.create(payload);

    this.saving.set(true);
    this.error.set(null);
    request$.subscribe({
      next: () => this.router.navigate(['/empleados']),
      error: (err) => {
        this.error.set(getErrorMessage(err));
        this.saving.set(false);
      }
    });
  }
}
