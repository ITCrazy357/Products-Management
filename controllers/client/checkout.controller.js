const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
const Order = require("../../models/order.model");

//[GET] /checkout/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      }).select("title thumbnail slug price discountPercentage");

      productInfo.priceNew = productHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }

  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );

  res.render("client/pages/checkout/index", {
    pageTitle: "Thanh Toán",
    cartDetail: cart,
  });
};

//[GET] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const products = [];
  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };

  const order = new Order(orderInfo);
  await order.save();

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    },
  );

  req.flash("success", "Đặt hàng thành công");

  res.redirect(`/checkout/success/${order.id}`);
};

//[GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
  });


  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.priceNew = productHelper.priceNewProduct(product);

    product.totalPrice = product.priceNew * product.quantity;
  }

  order.totalPrice = order.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );

  res.render("client/pages/checkout/success", {
    pageTitle: "Thanh toán thành công",
    order: order,
  });
};

//[GET] /checkout/history
module.exports.history = async (req, res) => {
  const cartId = req.cookies.cartId;

  const orders = await Order.find({
    cart_id: cartId,
  });

  for (const order of orders) {
    for (const product of order.products) {
      const productInfo = await Product.findOne({
        _id: product.product_id,
      }).select("title thumbnail");

      product.productInfo = productInfo;
      product.priceNew = productHelper.priceNewProduct(product);
      product.totalPrice = product.priceNew * product.quantity;
    }

    order.totalPrice = order.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
  }

  res.render("client/pages/checkout/history", {
    pageTitle: "Lịch sử đơn hàng",
    orders: orders,
  });
};
