const mongoose = require('mongoose');
module.exports = (() => {
    const connect = async(uri) => {
        return await mongoose.createConnection(uri, {
            // Buffering means mongoose will queue up operations if it gets
            // disconnected from MongoDB and send them when it reconnects.
            // With serverless, better to fail fast if not connected.
            useNewUrlParser: true,
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0 // and MongoDB driver buffering
        });
    }

    return { connect };
})()
