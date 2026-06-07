// This file is overwritten to fix stale Prisma Client issues
export interface User {
  id: number;
  username: string;
  password: string;
  role: "ADMIN" | "CASHIER";
  createdAt: Date;
}
