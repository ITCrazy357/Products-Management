declare module "express" {
  import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction, Handler } from "express-serve-static-core";

  export type Request = ExpressRequest;
  export type Response = ExpressResponse;
  export type NextFunction = ExpressNextFunction;
  export type RequestHandler = Handler;

  const express: {
    (): any;
  };

  export default express;
}

declare module "express-serve-static-core" {
  export type Request = any;
  export type Response = any;
  export type NextFunction = any;
}

