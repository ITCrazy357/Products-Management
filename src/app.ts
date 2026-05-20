import express from "express";



// Types are intentionally permissive while migrating legacy JS -> TS
// to avoid blocking compilation before full model/type conversion.
type ExpressRequest = any;
type ExpressResponse = any;
type ExpressNextFunction = any;

import path from "path";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import moment from "moment";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const systemConfig = require("../config/system.js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connect: connectDb } = require("../config/database.js");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const routeClient = require("../routes/client/index.route.js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const routeAdmin = require("../routes/admin/index.route.js");


// Fallback typing for legacy JS modules during migration
// (keeps code compileable until we convert these modules to TS)
const legacyAny = require("module");



// Legacy imports (JS CommonJS) are treated as typed modules via `types/*.d.ts`.


export function buildApp() {
  void connectDb();

  const app = express();


  // View Engine
  app.set("views", path.join(process.cwd(), "views"));
  app.set("view engine", "pug");

  // Middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));

  (app as any).use((express as any).static(path.join(process.cwd(), "public")));


  app.use(cookieParser("nmd2614"));
  app.use(
    session({
      secret: "nmd2614",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
    }),
  );
  app.use(flash());

  app.use((req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    // connect-flash attaches flash() at runtime
    (res.locals as Record<string, unknown>).messages = (req as any).flash?.();
    next();
  });


  // TinyMCE static
  app.use(
    "/tinymce",
    (express as any).static(path.join(process.cwd(), "node_modules", "tinymce")),

  );

  // App Local Variables
  app.locals.prefixAdmin = systemConfig.prefixAdmin;
  app.locals.moment = moment;

  // Routes
  routeClient(app);
  routeAdmin(app);

  app.use((req: ExpressRequest, res: ExpressResponse) => {
    res.status(404).render("client/pages/errors/404", {
      pageTitle: "404 Not Found",
    });
  });


  return app;
}

export default buildApp;

