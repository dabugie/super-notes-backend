export interface SignupUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userData: Record<string, unknown>;
}
