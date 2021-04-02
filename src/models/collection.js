const mongoose = require ('mongoose');

const collectionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

collectionSchema.virtual('product', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'collections',
})

const Collection = mongoose.model('Collection', collectionSchema);


module.exports = Collection;