const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination")
// [GET] /admin/products
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query)
    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status;
    }
    // Tìm kiếm  
    const objectSearch = searchHelper(req.query);

    // console.log(objectSearch);

    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }

    //Pagination
    const countProduct = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    },
    req.query,
    countProduct
);

    

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh Sách Sản Phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}; 

// [PATCH] /admin/products/change-status/:status/:id 
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id}, { status: status})

    res.redirect(req.get("Referrer") || "/admin/products")
}


// [PATCH] /admin/products/change-multi 
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type){
        case "active":
            await Product.updateMany({_id: { $in: ids } }, {status: "active"});
            break;
        case "inactive":
            await Product.updateMany({_id: { $in: ids } }, {status: "inactive"});
            break;
        default:
            break;
    }

    res.redirect(req.get("Referrer") || "/admin/products")
}

// [DELETE] /admin/products/delete/:id 
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
//await Product.updateOne({ _id: id})
    await Product.updateOne({ _id: id}, { 
        deleted: true,
        deletedAt:new Date()
    });

    res.redirect(req.get("Referrer") || "/admin/products")
}


// [GET] /admin/products/trash
module.exports.trash = async (req, res) => {

    let find = {
        deleted: true
    };

    const countProduct = await Product.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    },
    req.query,
    countProduct
    );

    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/trash", {
        pageTitle: "Sản phẩm đã xóa",
        products: products,
        pagination: objectPagination
    });
};


// [PATCH] /admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne(
        { _id: id },
        {
            deleted: false,
            deletedAt: null
        }
    );

    res.redirect(req.get("Referrer") || "/admin/products/trash");
};