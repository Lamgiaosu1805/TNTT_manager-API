const UserModel = require("../models/UserModel")
const XuDoanModel = require("../models/XuDoanModel")
const generatePassword = require("../utils/generatePassword")

const XuDoanController = {
    createXuDoan: async (req, res, next) => {
        const body = req.body
        try {
            const newXuDoan =  new XuDoanModel({
                tenXuDoan: body.tenXuDoan,
                tenGiaoXu: body.tenGiaoXu
            })
            const password = await generatePassword()
            const username = await UserModel.countDocuments()
            await newXuDoan.save()
                .then(result => {
                    const newAdminXuDoan = new UserModel({
                        username: 'admin' + username,
                        password: password.hashedPassword,
                        fullName: `Xứ đoàn ${result.tenXuDoan} - Giáo xứ ${result.tenGiaoXu}`,
                        roleId: 2,
                        idXuDoan: result._id,
                    })
                    return newAdminXuDoan
                })
                .then(result => {
                    result.save()
                        .then(result2 => {
                            res.json({
                                status: true,
                                data: {
                                    username: result2.username,
                                    password: password.realPassword
                                }
                            })
                        })
                        .catch(e => res.send(e))
                })
                .catch(e => {
                    res.send(e)
                })
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = XuDoanController