const UserModel = require("../models/UserModel")
const XuDoanModel = require("../models/XuDoanModel")
const generatePassword = require("../utils/generatePassword")
const mongoose = require('mongoose')
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")
const ExcelJS = require('exceljs');
const NganhModel = require("../models/NganhModel")

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
    },
    addDoanSinhByExcelFile: async (req, res, next) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        else {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const listNganh = await NganhModel.find()
                const user = await UserModel.findById(req.user.id)
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(req.file.buffer);
                const worksheet = workbook.getWorksheet(1); // Lấy worksheet đầu tiên
                let headers = [];
                let data = [];
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) {
                        headers = row.values.slice(1); // Bỏ giá trị đầu tiên vì nó là null
                    } else {
                        let rowData = {};
                        row.values.slice(1).forEach((value, index) => {
                            rowData[headers[index]] = value;
                        });
                        data.push(rowData);
                    }
                });
                const listClassBefore = data.map(ele => {
                    return {
                        className: ele.Lop,
                        tenNganh: ele.Nganh
                    }
                })
                const listClassBeforeUnique = Array.from(new Set(listClassBefore.map(JSON.stringify)), JSON.parse);
                const listClassBeforeData = listClassBeforeUnique.map(ele => {
                    return {
                        className: ele.className,
                        tenNganh: ele.tenNganh,
                        idXuDoan: user.idXuDoan,
                        idNganh: listNganh.find(e=> e.tenNganh == ele.tenNganh).id
                    }
                });
                // console.log(listClassBeforeData)
                await session.commitTransaction();
                session.endSession();
                res.json({
                    total: data.length,
                    data: data
                });
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                console.log(error)
            }
        }
    }
}

module.exports = XuDoanController