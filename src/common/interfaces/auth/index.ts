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
export interface IAccessToken {
  token: string;
  exp: Date;
  userId: string;
}
export interface IToken {
  token: string;
  refreshToken: IAccessToken;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
