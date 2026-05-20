

declare module "express" {
  interface Locals {
    user?: unknown;
    role?: unknown;
    userInfo?: {
      id: string;
      fullname?: string;
      role?: string;
    };
    messages?: Record<string, string[]>;
    prefixAdmin?: string;
    moment?: unknown;
  }
}

