const { createFinancialCovenant } = require('./Contracts/CovenantTriggerContract');

const initSmartContract = async (customerId, type = 'covenant', contractArgs = {}) => {
    if (contractArgs['eSign']) { contractArgs['eSign'] = {...contractArgs, s3Location: '', 'documentType': ''}}
    let smartContract;
    switch (type) {
        case 'covenant':
            smartContract = createFinancialCovenant(customerId,{...contractArgs, contractType: type})
            break;
        case 'risk-downgrade':
            break;
        default:
            smartContract = createFinancialCovenant(customerId,{...contractArgs, contractType: type})
            break;
    }
    return smartContract
}

module.exports.initSmartContract = initSmartContract;