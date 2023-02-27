const jwt       = require("jsonwebtoken");
const jwtSecret = process.env.JWT_TOKEN;


const checkPermissionsMiddleware = async (req, res, next) => {
    if (!req.headers['authorization']) { return res.status(401).send({ message: "Access Restricted" })};
    jwt.verify(req.headers['authorization'], jwtSecret, (err, verifiedToken) => {
        if (err) { return res.status(401).send({ message: "Access Restricted", error: err }) }
        if (!verifiedToken.role) { return res.status(401).send({ message: "Access Restricted", error: err }) } 
        else {
            req.userObj = verifiedToken;
            next();
        }
    });
}


const addHeader = async (req,res,next) => {
    if (!req.cookies['jwt']) { return res.status(401).send({ message: "Access Restricted"})};
    let token = req.cookies['jwt']['token'];
    req.headers.Authorization = `${token}`
    return next()
}

module.exports.addHeader = addHeader;
module.exports.checkPermissionsMiddleware = checkPermissionsMiddleware;