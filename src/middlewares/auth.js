const jwt = require('jsonwebtoken');

const auth = {
    //verify
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization;
        if(token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
                if(err) {
                    res.json({
                        code: 403,
                        message: "Token is not valid"
                    });
                }
                else {
                    req.user = user;
                    next();
                }
            })
        }
        else {
            res.json({
                code: 401,
                message: "Not Authenticated"
            })
        }
    },

    verifyTokenForAdmin: (req, res, next) => {
        auth.verifyToken(req, res, () => {
            if(req.user.roleId <= 1) {
                next();
            }
            else {
                res.status(403).json("Not Allowed")
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