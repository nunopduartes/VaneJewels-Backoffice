const mongoose = require ('mongoose');

const cartSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        ref: 'User'
    },
}, {
    timestamps: true,
});

cartSchema.virtual('cart', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'cart',
});

cartSchema.methods.getCart = function() {
    const cart = this;
    const cartObject = cart.toObject();

    return cartObject;
}

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;