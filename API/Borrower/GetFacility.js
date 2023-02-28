const User   = require('../../Schemas/Users/UserSchema');

const getFacility = async (req, res) => {
    if (!req.userObj || typeof req.userObj._id !== 'string') { return res.status(401).send("Access Restricted")}
    let validUser = await User.findOne({_id: req.userObj._id});
    if (!validUser) return res.status(400).send({ error: "User authentication error", message: "No such user found"})
    let facilities = await User.find({ _id: req.userObj._id}, { _id: 0, facility: 1 });
    return res.status(200).send(facilities.map(e => e.facility).flat(1).slice(0,5) || [])
}

module.exports.getFacility = getFacility;
