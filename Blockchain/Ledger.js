const moment = require('moment');
const SHA256  = require("crypto-js/sha256");

class LedgerBlock {
    constructor(index, timestamp, data, precedingHash=""){
        this.index = index || 0;
        this.timestamp = timestamp 
        this.data = data;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash()
    }
    computeHash(){
        var hash = SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data)) || '';
        return hash.toString();
    }
}

class Blockchain{
    constructor(startDate = moment().toDate()) {
        this.blockchain = [];
        this.startDate  = startDate;
    }

    startGenesisBlock(ledgerTapeSchema = {}) {
        if (this.getLatestLedgerBlock().length > 0) { return }
        var startblock = new LedgerBlock(0,this.startDate, ledgerTapeSchema, "");
        this.blockchain.push(startblock);
    }

    getGenesisBlock(){
        if (this.blockchain.length === 0) return []
        return this.blockchain[0];
    }

    getLatestLedgerBlock(){
        if (this.blockchain.length === 0) return []
        return this.blockchain[this.blockchain.length - 1];
    }

    appendLedgerBlock(data){
        var latestBlock = this.getLatestLedgerBlock();
        var newIndex    = latestBlock.index + 1
        var newBlock    = new LedgerBlock(newIndex , moment().toDate(), data, latestBlock.hash);
        newBlock.computeHash();
        this.blockchain.push(newBlock);
    }

    isChainValid(){
        for (let i = 1; i < this.blockchain.length; i++){
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i-1];
            if (currentBlock.hash !== currentBlock.computeHash()) return false;
            if (currentBlock.precedingHash !== precedingBlock.hash) return false;
        }
        return true;
    }
}

const addLedgerBlockStatic = (blockchain = [], data = {}) => {
    var latestBlock = blockchain[blockchain.length - 1] || null;
    if (!latestBlock) { return console.log('No latest block')}
    var newIndex    = latestBlock.index + 1;
    var newBlock    = new LedgerBlock(newIndex , moment().toDate(), data, latestBlock.hash);
    newBlock.computeHash();
    blockchain.push(newBlock)
    return blockchain;
}


module.exports.Blockchain  = Blockchain;
module.exports.LedgerBlock = LedgerBlock;
module.exports.addLedgerBlockStatic = addLedgerBlockStatic;