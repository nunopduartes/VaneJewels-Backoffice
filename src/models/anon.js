const mongoose = require ('mongoose');

const anonSchema = new mongoose.Schema({
    sessionID: {
        type: String,
        required: true,
        unique: true,
    },
}, {
        timestamps: true
});

anonSchema.virtual('cart', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'owner',
});

const Anon = mongoose.model('anon', anonSchema);

module.exports = Anon;