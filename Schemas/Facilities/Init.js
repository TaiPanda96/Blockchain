const moment = require('moment');
const { mongoOptimusUser } = require('../Customers/CustomerSchema');

const { getNestedObject } = require('../../Utility');

const initializeFacilityInfo = async (customerId, facility = {}) => {
    if (Object.keys(facility).length === 0) throw Error('Facility Object is empty');
    let customer;
    try {
        const existingCustomer = await mongoOptimusUser.findOne({customerId: customerId});
        if (!existingCustomer) { return }
        customer = existingCustomer;
        return {
            // Initialize Customer
            customer,
            // Initialize Facility
            loanID: getNestedObject(facility, ['loanID']) || '',
            loanStatus: getNestedObject(facility, ['loanStatus']) || '',
            loanPurpose: getNestedObject(facility, ['loanPurpose']) || '',
            assetClass: getNestedObject(facility, ['assetClass']) || 'P2P',
            advanceDate: getNestedObject(facility, ['advanceDate']) || moment().subtract('1', 'months').toDate(),
            repaymentStartDate: getNestedObject(facility, ['repaymentStartDate']) || moment().subtract('3', 'months').toDate(),
            lastRepaymentDate: getNestedObject(facility, ['lastRepaymentDate']) || moment().subtract('3', 'months').toDate(),
            status: getNestedObject(facility, ['status']) || 'Active',
            originalReceivableBalance: getNestedObject(facility, ['originalReceivableBalance']) || 1000,
            interest: getNestedObject(facility, ['interest']) || 0.6,
            repaymentPeriod: getNestedObject(facility, ['repaymentPeriod']) || 36
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.initializeFacilityInfo = initializeFacilityInfo;