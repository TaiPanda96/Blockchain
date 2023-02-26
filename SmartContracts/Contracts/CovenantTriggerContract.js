const Borrower = require("../../Schemas/Users/UserSchema");

const createFinancialCovenant = async (args = {}) => {
    return  {
        borrowerId: args['_id'].toString(),
        email: args['email'],
        contractId: args['contractId'],
        contractType: args['contractType'],
        parties: [args['customerName']],
        triggerOn: args['triggerSteps'] || [],
        executionSteps: args['executionSteps'] || [],
        settlementSteps: args['settlementSteps'] || []
    }
}

module.exports.createFinancialCovenant = createFinancialCovenant;