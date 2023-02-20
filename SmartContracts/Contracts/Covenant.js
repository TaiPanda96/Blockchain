const mongoOptimCustomer = require("../../Schemas/Customers/CustomerSchema");

const createFinancialCovenant = async (customerId) => {
    let existingCustomer = await mongoOptimCustomer.findOne({customerId: customerId});
    if (!existingCustomer) { return }
    return  {
        customerContract: existingCustomer,
        contractType: "Profitability Ratio Covenant",
        parties: [
            'Goldman Sachs',
            existingCustomer.customerName
        ],
        triggerConditions: [
            { type: 'Financial Health Conditions', event: 'financial-covenant', description: 'Lender EBITDA and Cashflow Margins Show Decreasing Trend', ratios: [
                {
                    ebitdaratio: 0.33,
                    cashFlowCoverageRatiosTTM: 0.85
                }
            ]},
        ], 
        executionSteps: [
            {type: 'Financials', function: 'getFinancials'},
            {type: 'Create Notification', function: 'createNotification'}
        ],
        settlementSteps: [
            { type: 'Notify Internal', email: 'taishanlin1996@gmail.com'},
            { type: 'Notify Customer', function: 'sendCustomerEmail'},
        ]
    }
}

module.exports.createFinancialCovenant = createFinancialCovenant;