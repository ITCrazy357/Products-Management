module.exports.priceNewProduct = (product) => {
  if (Array.isArray(product)) {
    return product.map((item) => {
      item.priceNew = (
        (item.price * (100 - item.discountPercentage)) /
        100
      ).toFixed(0);
      return item;
    });
  } else {
    return (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(0);
  }
};