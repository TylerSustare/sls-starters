// teardown.js
module.exports = async function() {
    console.log('\nmongo teardown\n')
    await global.__MONGOD__.stop();
};
