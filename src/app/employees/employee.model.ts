export interface Employee {
  _id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: string;
  updatedAt?: string;
}

export type EmployeeInput = Omit<Employee, '_id' | 'createdAt' | 'updatedAt'>;

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: { path: (string | number)[]; message: string }[];
  };
}
