export interface User {
    id: number;
    email: string;
    password: string;
  }
  
  // Tipo para el payload del token JWT
  export interface JwtPayload {
    id: number;
    email: string;
  }
  