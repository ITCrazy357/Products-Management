const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");


//[GET] /admin/auth/login
module.exports.login = (req, res) =>{
    res.render("admin/pages/auth/login", {
        pageTitle: "Đăng nhập"
    })
}

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        password: md5(password),
        deleted: false
    })

    if(!user){
        req.flash("error", "Email hoặc mật khẩu không đúng!")
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        return;
    }

    if(user.status !== "active"){
        req.flash("error", "Tài khoản của bạn đã bị khóa!")
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        return;
    }

    req.session.user = user; // Giữ lại gán session dự phòng nếu hệ thống bạn vẫn dùng
    res.cookie("token", user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)

}