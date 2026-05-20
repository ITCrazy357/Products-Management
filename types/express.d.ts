import type { RoleDocument } from "../src/models/role.model";
import type { AccountDocument } from "../src/models/account.model";

declare global {
  namespace Express {
    interface Locals {
      user?: AccountDocument;
      role?: RoleDocument;

      // Client side auth middleware currently uses res.locals.userInfo
      userInfo?: {
        id: string;
        fullname?: string;
        role?: string;
      };

      // flash messages used across pug
      messages?: Record<string, string[]>;

      prefixAdmin?: string;
      moment?: unknown;
    }

    interface Request {
      body: unknown;
      query: Record<string, unknown>;
      params: Record<string, string>;
      session?: Record<string, unknown>;
    }
  }
}

export {};

