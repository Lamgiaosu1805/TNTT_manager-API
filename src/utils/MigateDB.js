const UserModel = require("../models/UserModel")

const Migrate = async () => {
    await UserModel.updateMany(
        {idXuDoanQly: {$exists: false}},
        {$set: {idXuDoanQly: ""}}
    );
    console.log("done")
}

module.exports = Migrate