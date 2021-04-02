const mongoose = require ('mongoose');

// Acabei por não dar uso a este modelo, por falta de tempo :( mas o uso seria para depois do post do cart em que
// guardava todas as orders, em que poderia ser usado por exemplo no perfil do user para ver todas as encomendas

const orderSchema = mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    method: {
        type: String,
        required: true,
        default: 'N/A',
    },
    total: {
        type: Number,
        required: true,
        default: 'N/A',
    },
    discount: {
        type: String
    },
}, {
    timestamps: true,
});

userSchema.virtual('carts', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'owner',
})

orderSchema.methods.getOrder = function() {
    const order = this;
    const orderObject = order.toObject();

    return orderObject;
}

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;