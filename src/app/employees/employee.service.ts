import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiErrorBody, ApiSuccess, Employee, EmployeeInput } from './employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/empleados';

  getAll(): Observable<Employee[]> {
    return this.http.get<ApiSuccess<Employee[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<ApiSuccess<Employee>>(`${this.baseUrl}/${encodeURIComponent(id)}`).pipe(map((res) => res.data));
  }

  create(employee: EmployeeInput): Observable<Employee> {
    return this.http.post<ApiSuccess<Employee>>(this.baseUrl, employee).pipe(map((res) => res.data));
  }

  update(id: string, employee: Partial<EmployeeInput>): Observable<void> {
    return this.http.put<ApiSuccess<null>>(`${this.baseUrl}/${encodeURIComponent(id)}`, employee).pipe(map(() => undefined));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiSuccess<null>>(`${this.baseUrl}/${encodeURIComponent(id)}`).pipe(map(() => undefined));
  }
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    const body = err.error as ApiErrorBody | null;
    if (body?.error) {
      const details = body.error.details?.map((d) => d.message).join(', ');
      return details ? `${body.error.message}: ${details}` : body.error.message;
    }
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor';
    }
  }
  return 'Ocurrió un error inesperado';
}
