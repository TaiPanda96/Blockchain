const bcrypt    = require('bcrypt');
const jwt       = require("jsonwebtoken");
const jwtSecret = process.env.JWT_TOKEN;

const User = require("../../Schemas/Users/UserSchema");

const generateTokens = async (userObj = {}) => {
    let payload = { _id: userObj._id.toString(), username: userObj.username, email: userObj.email, role: userObj.role}
    const accessToken  = jwt.sign(payload, jwtSecret, { expiresIn: "30m"});
    const refreshToken = jwt.sign(payload, jwtSecret, { expiresIn: '60d'});
    const userToken = await User.findOne({ _id: userObj._id, accessToken: {$exists: true}});
    if (userToken) { await User.updateOne({ _id: userObj._id}, {$set: { accessToken: accessToken, refreshToken: refreshToken}}) }
    await User.updateOne({_id: userObj._id, }, { $set: { accessToken: accessToken, refreshToken: refreshToken } })
    return { userObj, accessToken : accessToken, refreshToken: refreshToken}
}

const refresh = async (req,res) => {
    if (!req.userObj) { return res.status(401).send({error: "Access Restricted"})}
    const existingUser = await User.findOne({ _id: req.userObj._id, accessToken: { $exists: true }});
    if (!existingUser) { return res.status(401).send({error: "Access Restricted"})}
    return { _id: authUser.userObj._id, username: authUser.userObj.username, email: authUser.userObj.email, role: authUser.userObj.role, accessToken: authUser.accessToken, refreshToken: authUser.refreshToken, expiresIn:  3 * 60 * 60 };
}

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
        User.create({ ...userPayload }).then(async (newUser) => {
        let authUser = await generateTokens(newUser);
        return res.status(200).send({ _id: authUser.userObj._id, username: authUser.userObj.username, email: authUser.userObj.email, role: authUser.userObj.role, accessToken: authUser.accessToken, refreshToken: authUser.refreshToken, expiresIn:  3 * 60 * 60 });
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
        if (!user) { return res.status(400).send({ error: "UserAuthError", message: "User does not exist"}) }
        let verify = bcrypt.compare(password, user.password);
        if (!verify) { return res.status(401).send({message: "Login Unsuccessful"}) };
        let authUser = await generateTokens(user);
        return res.status(200).send({ _id: authUser.userObj._id, username: authUser.userObj.username, email: authUser.userObj.email, role: authUser.userObj.role, accessToken: authUser.accessToken, refreshToken: authUser.refreshToken, expiresIn:  3 * 60 * 60 });
    } catch (err) {
        console.log(err);
        return res.status(400).send({message: "Unable to register user" , error: err.message})
    }

}


module.exports.register = register;
module.exports.login    = login;
