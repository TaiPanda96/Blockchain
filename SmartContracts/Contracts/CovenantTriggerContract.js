const mongoOptimCustomer = require("../../Schemas/Customers/CustomerSchema");

const createFinancialCovenant = async (customerId, args = {}) => {
    let existingCustomer = await mongoOptimCustomer.findOne({customerId: customerId});
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