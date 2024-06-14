const UserModel = require("../models/UserModel")
const XuDoanModel = require("../models/XuDoanModel")
const generatePassword = require("../utils/generatePassword")
const mongoose = require('mongoose')
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")

const XuDoanController = {
    createXuDoan: async (req, res, next) => {
        const body = req.body
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const newXuDoan =  new XuDoanModel({
                tenXuDoan: body.tenXuDoan,
                tenGiaoXu: body.tenGiaoXu,
                avtUrl: body.avtUrl,
                ngayThanhLap: body.ngayThanhLap
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
            res.json(SuccessResponse({
                username: dataAdminXuDoanNew.username,
                password: password.realPassword
            }))
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error)
            res.json(FailureResponse("11", error))
        }
    }
}

module.exports = XuDoanController