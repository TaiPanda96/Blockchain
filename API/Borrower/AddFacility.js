const moment = require('moment');
const User   = require('../../Schemas/Users/UserSchema');
const { eventEmitter } = require('../../Triggers/GlobalEmitter');

const addFacility = async (req, res) => {
    if (!req.userObj || typeof req.userObj._id !== 'string') { return res.status(401).send("Access Restricted")}
    let validUser = await User.findOne({_id: req.userObj._id});
    if (!validUser) return res.status(400).send({ error: "User authentication error", message: "No such user found"});
    let { assetClass, facilityName, interest, principal } = req.body;
    let facilityObj = {
        assetClass,
        facilityName,
        interest, 
        principal, 
        addedDate: moment().local().toDate(),
    }
    User.updateOne({ _id: req.userObj._id}, { $push: { facility : facilityObj } }).then(() => {
        console.log("Facility added to", req.userObj._id);
        eventEmitter.emit("risk-review", req.userObj);
        return res.status(200).send(true)
    }).catch(err =>  { 
        console.log(err)
    })
}

module.exports.addFacility = addFacility;
