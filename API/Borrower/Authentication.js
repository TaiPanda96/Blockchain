const moment    = require("moment");
const bcrypt    = require('bcrypt');
const jwt       = require("jsonwebtoken");
const jwtSecret = process.env.JWT_TOKEN;
const { eventEmitter } = require('../../Triggers/GlobalEmitter');

const User = require("../../Schemas/Users/UserSchema");

const register = async (req, res) => {
    const { username, password, email, role } = req.body;
    if (!email || !password || !role) { return res.status(400).send({ error: "Invalid parameters" }) }
    if (!['admin', 'lender', 'borrower'].includes(role)) { return res.status(400).send({ error: "Invalid role type"})}

    // Check existing username 
    let existingUsername = await User.findOne({ username: username });
    if (existingUsername) { return res.status(400).send({ error: "Sorry, this username and profile already exists." }); }
    
    // Check password length
    if (password.length < 8) { return res.status(400).send({ error: "Password Length is less than 6" }) }
    // bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userPayload = {
        username: username || '',
        password: hashedPassword,
        email:  email || '',
        role: role,
    }

    // verify user
    try {
        User.create({ ...userPayload }).then((newUser) => {
            const token  = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role, expiresIn:  3 * 60 * 60}, jwtSecret);
            res.cookie("jwt", token, { maxAge: 3 * 60 * 60 * 1000 });
            eventEmitter.emit('customer', { ...newUser, updatedAt: moment().toDate() });
            return res.status(200).send("User successfully created");
        });
    } catch (err) {
        console.log(err)
        return res.status(401).send({ message: "User registration failed"});
    }
}

const login = async (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) { return res.status(400).send({error: "invalid username or password"})};

    // verify user 
    try {
        const user = await User.findOne({ username: username });
        if (!user) { return res.status(400).send('User does not exist') }
        bcrypt.compare(password, user.password).then((result) => {
            if (!result) { return res.status(401).send({message: "Login Unsuccessful"}) } 
            const token  = jwt.sign({ id: user._id, username: user.username, role: user.role, expiresIn:  3 * 60 * 60 },jwtSecret);
            res.cookie("jwt", token, { maxAge: 3 * 60 * 60 * 1000 });
            return res.status(200).send({ id: user._id, username: user.username, email: user.email, role: user.role, expiresIn:  3 * 60 * 60 });
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({message: "Unable to register user" , error: err.message})
    }

}

const checkPermissionsMiddleware = async (req, res, next) => {
    if (!req.cookies['jwt']) { return res.status(401).send({ message: "Access Restricted" })};
    jwt.verify(req.cookies['jwt'], jwtSecret, (err, verifiedToken) => {
        if (err) { return res.status(401).send({ message: "Access Restricted", error: err }) }
        if (!verifiedToken.role) {
            return res.status(401).send({ message: "Access Restricted", error: err });
        } else {
            req.cachedData = verifiedToken;
            return next();
        }
    });
}


module.exports.register = register;
module.exports.login    = login;
module.exports.checkPermissionsMiddleware = checkPermissionsMiddleware;
