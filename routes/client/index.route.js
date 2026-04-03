const categoryMiddleware = require("../../middlewares/client/category.midedleware")
const productRoutes = require("./product.route")
const homeRoutes = require("./home.route")

module.exports = (app) => {
  app.use(categoryMiddleware.category)
  app.use("/", homeRoutes);

  app.use("/products", productRoutes)
}