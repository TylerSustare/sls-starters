const { Schema, model } = require('mongoose');

const sporkSchema = new Schema({
    name: String,
    material: String,
    hasLittleKnifeSide: Boolean,
});
const Spork = model('Spork', sporkSchema);

module.exports = Spork;
