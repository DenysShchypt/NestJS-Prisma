export interface IJwtPlayLoad {
  user: IUserJWT;
  iat: number;
  exp: number;
}

export interface IUserJWT {
  email: string;
  name: string;
  roles: Role[];
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
