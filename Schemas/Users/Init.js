const { getNestedObject }  = require('../../Utility');
const { mongo } = require('mongoose');

const initializeUser = async (userObj = {}) => {
    if (Object.keys(userObj).length === 0) throw Error('Customer Object is empty');
    let organization = {
        username: getNestedObject(userObj, ['username']) || '',
        email:  getNestedObject(userObj, ['email']) || '',
        password: getNestedObject(userObj, ['password']) || '',
        userRole: getNestedObject(userObj, ['userRole']) || '',
        customerId: getNestedObject(userObj, ['customerId']) || '',
        orgLabel: getNestedObject(userObj, ['orgLabel']) || '',
    }
    return organization;
}

module.exports.initializeUser  = initializeUser;