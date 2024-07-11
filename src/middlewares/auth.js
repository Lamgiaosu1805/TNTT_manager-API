const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { FailureResponse } = require('../utils/ResponseRequest');

const auth = {
    //verify
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization;
        if(token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.SECRET_KEY, async (err, user) => {
                if(err) {
                    res.json(FailureResponse('14'))
                }
                else {
                    req.user = user;
                    try {
                        const validatedUser = await UserModel.findById(user.id)
                        if(validatedUser?.isActive) {
                            next();
                        }
                        else {
                            res.json(FailureResponse("03"))
                        }
                    } catch (error) {
                        console.log(error)
                        res.json(FailureResponse("04"))
                    }
                    
                }
            })
        }
        else {
            res.json(FailureResponse('13'))
            console.log("Not Authenticated")
        }
    },

    verifyTokenForAdmin: (req, res, next) => {
        auth.verifyToken(req, res, () => {
            if(req.user.roleId <= 1) {
                next();
            }
            else {
                res.json(FailureResponse('14'))
            }
        })
    },

    verifyTokenForAdminXuDoan: (req, res, next) => {
        auth.verifyToken(req, res, () => {
            if(req.user.roleId <= 2 ) {
                next();
            }
            else {
                res.status(403).json("Not Allowed")
            }
        })
    }

}

module.exports = auth;