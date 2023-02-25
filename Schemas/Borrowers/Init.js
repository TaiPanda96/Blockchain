const { getNestedObject }  = require('../../Utility');

const BorrowerProfile = async (customer = {}) => {
    if (Object.keys(customer).length === 0) throw Error('Customer Object is empty');
    let customerId = mongo.ObjectId();
    let organization = {
        customerId: customerId,
        orgLabel: getNestedObject(customer, ['orgLabel']) || '',
        customerName: getNestedObject(customer, ['customerName']) || '',
        customerType: getNestedObject(customer, ['customerType']) || '',
        customerAddress: getNestedObject(customer, ['customerAddress']) || '',
        customerCity: getNestedObject(customer, ['customerCity']) || '',
        customerState: getNestedObject(customer, ['customerState']) || '',
        customerZip: getNestedObject(customer, ['customerZip']) || '',
        customerCountry: getNestedObject(customer, ['customerCountry']) || '',
        customerPhone: getNestedObject(customer, ['customerPhone']) || '',
        customerEmail: getNestedObject(customer, ['customerEmail']) || '',
        customerWebsite: getNestedObject(customer, ['customerWebsite']) || '',
        customerIndustry: getNestedObject(customer, ['customerIndustry']) || '',
        customerIndustrySub: getNestedObject(customer, ['customerIndustrySub']) || '',
        customerSIC: getNestedObject(customer, ['customerSIC']) || '',
        customerNAICS: getNestedObject(customer, ['customerNAICS']) || '',
    }
    return organization;
}

module.exports.getNestedObject = getNestedObject;
module.exports.BorrowerProfile = BorrowerProfile;