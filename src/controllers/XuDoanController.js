const XuDoanController = {
    createXuDoan: async (req, res, next) => {
        const body = req.body
        console.log(body)
        res.json(body)
    }
}

module.exports = XuDoanController