const UserModel = require("../models/UserModel")
const XuDoanModel = require("../models/XuDoanModel")
const generatePassword = require("../utils/generatePassword")
const mongoose = require('mongoose')

const XuDoanController = {
    createXuDoan: async (req, res, next) => {
        const body = req.body
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const newXuDoan =  new XuDoanModel({
                tenXuDoan: body.tenXuDoan,
                tenGiaoXu: body.tenGiaoXu
            })
            const password = await generatePassword()
            const idAccount = await UserModel.countDocuments()
            const dataXuDoanNew = await newXuDoan.save({session})
            const newAdminXuDoan = new UserModel({
                username: 'admin' + idAccount,
                password: password.hashedPassword,
                fullName: `Xứ đoàn ${dataXuDoanNew.tenXuDoan} - Giáo xứ ${dataXuDoanNew.tenGiaoXu}`,
                roleId: 2,
                idXuDoan: dataXuDoanNew._id,
            })
            const dataAdminXuDoanNew = await newAdminXuDoan.save({session})
            await session.commitTransaction();
            session.endSession();
            res.json({
                status: true,
                data: {
                    username: dataAdminXuDoanNew.username,
                    password: password.realPassword
                }
            })
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error)
            res.send(error)
        }
    }
}

module.exports = XuDoanController