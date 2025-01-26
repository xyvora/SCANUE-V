export interface UserCreate {
  email: string;
  fullName: string;
  password: string;
}

export interface UserUpdateMe {
  email?: string;
  fullName?: string;
}
