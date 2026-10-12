export type Role = 'admin' | 'counselor';

export interface Account {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  isFixed: boolean;
}
