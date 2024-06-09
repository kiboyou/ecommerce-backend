const jwt = require('jsonwebtoken');
const { token } = require('morgan');

const verifyToken = (req, res, next) => {
    const AuthHeaders = req.headers.token

    if (AuthHeaders) {

        const token = AuthHeaders.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("token invalide")
            else {
                req.user = user;
                next()
            }
        })
    } else {
        res.status(403).json("token manquant")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(401).json(res.user.id)
        }
    })
}


const verifyisAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(401).json('vous n etes pas Administrateur ')
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyisAdmin }