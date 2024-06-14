const UserModel = require("../models/UserModel")
const bcrypt = require('bcrypt');
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest");

const UserController = {
    getUserInfo: async (req, res, next) => {
        try {
            const user = await UserModel.findById(req.user.id)
            if(user) {
                const {password, ...others} = user._doc;
                res.json(SuccessResponse({...others}))
            }
            else {
                res.json(FailureResponse("03"))
            }
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("04", error))
        }
    },

    changePassword: async(req, res, next) => {
        const {body} = req
        try {
            const user = await UserModel.findById(req.user.id)
            if(user) {
                if(body.oldPassword === body.newPassword) {
                    res.json(FailureResponse("08"))
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
                        res.json(SuccessResponse({
                            message: "Đổi mật khẩu thành công"
                        }))
                    }
                    else{
                        res.json(FailureResponse("09"))
                    }
                }
            }else {
                res.json(FailureResponse("03"))
            }
        } catch (error) {
            res.json(FailureResponse("10", error))
        }
    }

}

module.exports = UserController