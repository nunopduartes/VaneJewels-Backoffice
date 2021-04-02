const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    /*variants: [{
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Variant'
        }
    }],*/
    collections: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
}, {
    timestamps: true,
});

productSchema.virtual('variant', {
    ref: 'Variant',
    localField: '_id',
    foreignField: 'product',
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;