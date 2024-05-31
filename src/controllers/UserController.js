const UserModel = require("../models/UserModel")
const bcrypt = require('bcrypt');

const UserController = {
    getUserInfo: async (req, res, next) => {
        try {
            const user = await UserModel.findById(req.user.id)
            if(user) {
                const {password, ...others} = user._doc;
                res.json({status: true, result: {...others}})
            }
            else {
                console.log("user không còn tồn tại")
            }
        } catch (error) {
            console.log(error)
        }
    },

    changePassword: async(req, res, next) => {
        const {body} = req
        try {
            const user = await UserModel.findById(req.user.id)
            if(user) {
                if(body.oldPassword === body.newPassword) {
                    res.send("Mật khẩu cũ không được trùng mật khẩu mới")
                }
                else {
                    const validPassWord = await bcrypt.compare(
                        body.oldPassword,
                        user.password
                    );
                    if(validPassWord) {
                        const salt = await bcrypt.genSalt(10);
                        const hashed = await bcrypt.hash(body.newPassword, salt);
                        await user.updateOne({password: hashed, isResetPassword: false})
                        res.json({status: true, message: "Cập nhật mật khẩu thành công", result: {}})
                    }
                    else{
                        res.send("Mật khẩu hiện tại không đúng")
                    }
                }
            }else {
                res.send("user không còn tồn tại")
            }
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = UserController