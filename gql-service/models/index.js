const mongoose = require('mongoose');
module.exports = (() => {
    // connection
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

    // models with a little dependency injection
    const Fork = (conn) => {
        const forkSchema = new mongoose.Schema({ name: String });
        conn.model('Fork', forkSchema);
        const M = conn.model('Fork');
        return M;
    }
    return { connect, Fork };
})()
