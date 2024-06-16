import { Prisma } from '@prisma/client';

export class Users implements Prisma.UserCreateInput {
  id: string;
  name: string;
  password: string;
  email: string;
  wallet: number;
}
