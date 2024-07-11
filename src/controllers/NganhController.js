const NganhModel = require("../models/NganhModel")
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")

const NganhController = {
    createNganh: async (req, res) => {
        const {body} = req
        try {
            const listNganhInfo = body.listNganhInfo
            await NganhModel.insertMany(listNganhInfo)
            res.json(SuccessResponse({
                message: "Tạo ngành thành công"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse('12', error))
        }
    }
}

module.exports = NganhController