import { Request } from "express";

export interface AuthUser {
  id: string;
  role: string;
}

export interface AuthRequest<
  Params = Record<string, string>,
  Body = Record<string, unknown>,
> extends Request<Params, unknown, Body> {
  user?: AuthUser;
}
