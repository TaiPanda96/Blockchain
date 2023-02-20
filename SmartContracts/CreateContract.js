const { createFinancialCovenant } = require('./Contracts/Covenant');

const initSmartContract = async (customerId, type = 'covenant', eSign = false) => {
    if (!contractName) { throw new Error('Contract name is required') }
    let { contractName,  } = contractArgs;
    if (eSign) { 
        // Get Document Link from S3
        contractArgs['eSign'] = {
            link: '',
            expiryDate: '',
        }
    }
    let smartContract;
    switch (type) {
        case 'covenant':
            smartContract = createFinancialCovenant(customerId)
            break;
        case 'risk-downgrade':
            break;
        default:
            smartContract = createFinancialCovenant(customerId)
            break;
    }
    return smartContract
}

module.exports.initSmartContract = initSmartContract;