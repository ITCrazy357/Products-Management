
const systemConfig = require("../../config/system");
const dashboardRoute = require("./dashboard.route") 
const productRoutes = require("./product.route") 


module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAmin;

  app.use(PATH_ADMIN + "/dashboard", dashboardRoute)

  app.use(PATH_ADMIN + "/products", productRoutes); 
}