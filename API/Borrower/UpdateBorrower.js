const moment = require('moment');
const User   = require('../../Schemas/Users/UserSchema');
const bcrypt = require('bcrypt');

const errorMessage = {
    errorStatus: true,
    date: moment().toDate()
}

const updateBorrowerProfile = async (req, res) => {
    let { id } = req.query;
    let { role,...rest } = req.body;
    if (typeof id !== 'string' ) { return res.status(400).send({...errorMessage, error: 'Invalid customer id'})};
    let validUser = await User.findById(id);
    if (!validUser) { return res.status(400).send("No user found")}
    if (role && role !== 'admin') { return res.status(401).send('Access Restricted')} 
    if (rest['password']) {
        // Check password length
        if (rest.password.length < 8) { return res.status(400).send({ error: "Password Length is less than 8" }) }
        // bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rest.password, salt);
        rest['password']     = hashedPassword;
    }
    let userProfile  = { ...rest };
    User.updateOne({ _id : id}, {...userProfile})
    .then(() => {
        console.log('Updated', validUser._id.toString())
        return res.status(200).send(true);
    }).catch(err => { return res.status(400).send({"error": err.message}) } )
}

module.exports.updateBorrowerProfile = updateBorrowerProfile;