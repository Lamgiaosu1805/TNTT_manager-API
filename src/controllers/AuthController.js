const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { SuccessResponse } = require('../utils/ResponseRequest');

const genAccessToken = (user) => {
    return jwt.sign({
        id: user._id,
        username: user.username,
        roleId: user.roleId,
    },
        process.env.SECRET_KEY,
        {
            expiresIn: "365d"
        }
    )
}

const signUp = async (body, role, res) => {
    try {
        const user = await UserModel.findOne({username: body.username})
        if(user) {
            res.json({
                status: false,
                message: 'username đã tồn tại'
            })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(body.password, salt);
            const newUser = new UserModel({
                username: body.username,
                password: hashed,
                roleId: role,
                fullName: body.fullname,
                idXuDoan: body.idXuDoan
            });
            await newUser.save()
                .then(resp => {
                    res.json(SuccessResponse())
                })
                .catch(error => {
                    console.log(error)
                    res.json({
                        status: false,
                        message: error,
                    })
                })
        }
    } catch (error) {
        console.log(error)
        res.json({
            status: false,
            message: error,
        })
    }
}


const AuthController = {
    signUp: (req, res, next) => {
        const body = req.body
        signUp(body, 4, res)
    },
    
    // createAdmin: async (req, res, next) => {
    //     const body = req.body
    //     signUp(body, 2, res)
    // },

    signIn: async(req, res, next) => {
        const {body} = req;
        try {
            const user = await UserModel.findOne({username: body.username})
            if(!user) {
                res.json({
                    status: false,
                    message: "username không tồn tại"
                })
            }
            else {
                const validPassWord = await bcrypt.compare(
                    body.password,
                    user.password
                );
                if(!validPassWord) {
                    res.json({
                        status: false,
                        message: "Wrong Password"
                    })
                }
                if(validPassWord) {
                    const accessToken = genAccessToken(user);
                    const {password, ...others} = user._doc;
                    res.json(SuccessResponse({...others, accessToken}))
                }
            }
        } catch (error) {
            console.log(error)
            res.json({
                status: false,
                message: "Đã có lỗi trong quá trình đăng nhập",
                error: error
            })
        }
    },
}

module.exports = AuthController