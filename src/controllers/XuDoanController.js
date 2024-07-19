const UserModel = require("../models/UserModel")
const XuDoanModel = require("../models/XuDoanModel")
const generatePassword = require("../utils/generatePassword")
const mongoose = require('mongoose')
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")
const ExcelJS = require('exceljs');
const NganhModel = require("../models/NganhModel")
const ClassModel = require("../models/ClassModel")
const DoanSinhModel = require("../models/DoanSinhModel")

const generateExcelFile = async (data, idXuDoan) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Tạo header (tên cột)
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Thêm dữ liệu
    data.forEach(row => {
        const values = headers.map(header => row[header]);
        worksheet.addRow(values);
    });

    // Lưu file Excel
    const filename = `${idXuDoan}.xlsx`;
    await workbook.xlsx.writeFile(filename);
    console.log(`File Excel đã được tạo: ${filename}`);
}

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
                //---- Tạo lớp
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
                const listClassAfter = await ClassModel.insertMany(listClassBeforeData, {session})

                // console.log(listClassBeforeData)---

                // -- Tạo account
                const listUserBefore = data.map(ele => {
                    return {
                        username: ele.SDT,
                        fullname: ele.HoTenPhuHuynh
                    }
                })
                const listUserBeforeUniq = Array.from(new Set(listUserBefore.map(JSON.stringify)), JSON.parse);
                const listAccount = await Promise.all(listUserBeforeUniq.map(async (ele) => {
                    const password = await generatePassword()
                    return {
                        idXuDoan: user.idXuDoan,
                        username: ele.username,
                        fullName: ele.fullname,
                        roleId: 4,
                        password: password.hashedPassword,
                        realPassword: password.realPassword
                    }
                })) 
                await UserModel.insertMany(listAccount, {session})
                // console.log(listAccount)------

                //----- Tạo Đoàn Sinh
                const listDoanSinh = data.map(ele => {
                    return {
                        fullName: ele.HoTenDoanSinh,
                        sdtPhuHuynh: ele.SDT,
                        idXuDoan: user.idXuDoan,
                        idClass: listClassAfter.find(e => e.className == ele.Lop).id,
                        className: ele.Lop,
                        dob: ele.NgaySinh,
                    }
                })
                const listDoanSinhData = await DoanSinhModel.insertMany(listDoanSinh, {session})
                const responseData = listDoanSinhData.map(ele => {
                    return {
                        fullName: ele.fullName,
                        ngaySinh: ele.dob,
                        tenPhuHuynh: listAccount.find(e => e.username == ele.sdtPhuHuynh).fullName,
                        username: ele.sdtPhuHuynh,
                        password: listAccount.find(e => e.username == ele.sdtPhuHuynh).realPassword,
                    }
                })
                await generateExcelFile(responseData, user.idXuDoan)

                await session.commitTransaction();
                session.endSession();
                res.json(SuccessResponse({
                    total: data.length,
                    data: responseData
                }));
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                res.json(FailureResponse("15", error))
            }
        }
    }
}

module.exports = XuDoanController