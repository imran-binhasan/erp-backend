export interface JwtPayload {
  userId: string;
  role: string;
  roleId: string;
  permissions: string[];
}
