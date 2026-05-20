declare module "../routes/client/index.route.js" {
  import type { Express } from "express";
  function routeClient(app: Express): void;
  export = routeClient;
}

declare module "../routes/admin/index.route.js" {
  import type { Express } from "express";
  function routeAdmin(app: Express): void;
  export = routeAdmin;
}


