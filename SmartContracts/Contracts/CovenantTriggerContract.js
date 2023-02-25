const Borrower = require("../../Schemas/Users/UserSchema");

const createFinancialCovenant = async (customerId, args = {}) => {
    let existingCustomer = await Borrower.findOne({customerId: customerId});
    if (!existingCustomer) { return }
    return  {
        customerId: existingCustomer.customerId,
        customerEmail: existingCustomer.customerEmail,
        contractId: args['contractId'],
        contractType: args['contractType'],
        parties: [existingCustomer.customerName],
        triggerOn: args['triggerSteps'] || [],
        executionSteps: args['executionSteps'] || [],
        settlementSteps: args['settlementSteps'] || []
    }
}

module.exports.createFinancialCovenant = createFinancialCovenant;