// jest.config.js
module.exports = {
    verbose: false,
    globalSetup: './__test__/setup.js',
    globalTeardown: './__test__/teardown.js',
    testEnvironment: './__test__/mongo-environment.js'
};
