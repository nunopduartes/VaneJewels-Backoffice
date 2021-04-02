const mongoose = require ('mongoose');

const itemSchema = mongoose.Schema({
    qnt: {
        type: Number,
        required: false,
        default: 1,
        validate(value) {
            if(value < 0) throw new Error("A quantidade não pode ser negative.");
        },
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Variant'
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cart'
    },
}, {
    timestamps: true,
})

itemSchema.virtual('cart', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'item',
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;