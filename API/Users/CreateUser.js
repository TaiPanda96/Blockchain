const moment = require('moment');
const { initializeUser } = require("../../Schemas/Users/Init");
const { eventEmitter }   = require("../../Triggers/GlobalEmitter");
const mongoOptimUser     = require("../../Schemas/Users/UserSchema");

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const createUser = async (req, res) => {
    if (Object.keys(req.body).some(key => {
        if (!req.body[key]) { return res.status(400).send({ ...errorMessage, error: `Invalid parameter ${key}` }) }
    }));
    const user = await initializeUser(req.body);
    if (!user) { return res.status(400).send({ ...errorMessage, error: `Invalid user object` }) }
    await mongoOptimUser.updateOne({ email: user.email }, { ...user }, { upsert: true, setDefaultsOnInsert: true });
    eventEmitter.emit('user', user);
    return res.status(200).send({ message: `user created successfully` });
}

module.exports.createUser = createUser;