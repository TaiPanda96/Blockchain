const mongoose = require("mongoose");

const mongoConfigurations = {
    useNewUrlParser: false,
    useUnifiedTopology: true
}

var connectionInstance = mongoose.createConnection(process.env.ATLASURI, mongoConfigurations);
module.exports = { connectionInstance }

