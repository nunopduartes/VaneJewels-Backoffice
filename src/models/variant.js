const mongoose = require ('mongoose');

const variantSchema = mongoose.Schema({
    color: {
        type: String,
    },
    material: {
        type: String,
    },
    size: {
        type: Number,
        validate(value) {
            if(value < 0) throw new Error("O tamanho terá de ser um valor positivo.");
        },
    },
    qnt: {
        type: Number,
        default: 1,
        validate(value) {
            if(value < 0) throw new Error("A quantidade não pode ser negativa.");
        },
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
}, {
    timestamps: true,
});

variantSchema.virtual('item', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'variantId',
})

/*variantSchema.virtual('productVariant', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'variant',
})*/

const Variant = mongoose.model('Variant', variantSchema);

module.exports = Variant;