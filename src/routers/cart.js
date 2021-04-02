const express = require('express');
const Cart = require('../models/cart')
const router = new express.Router();
const logged = require('../middleware/logged');
const Item = require('../models/item');
const { sendBuyMail } = require('../emails/account');

// GET do carrinho associado ao Login ou Session, dando sempre preferencia ao Login.
router.get('/cart', logged, async (req, res) => {
    if(!req.user){
        return res.status(400).send('Não tem carrinho disponível');
    }

    try {
        const cart = await Cart.findOne({owner: req.user._id});

        if(!cart) {
            return res.status(400).send('Não existe carrinho disponível');
        }

        const items = await Item.find({cartId: cart._id});
        res.status(200).send(items);
    } catch(e) {
        res.status(400).send(e);
    }
});

//POST - Aqui enviaria a lista de variantes e produtos para a coleção "Orders", associada a este carrinho
// , deletava o carrinho, e enviaria o email de compra

// Não tive tempo de fazer a logica e uso do modelo Orders, no entanto ficou feito o envio de email de compras

router.post("/cart", logged,  async(req, res) => {
    try {
        sendBuyMail(req.user.email, req.user.name);
        res.status(200).send('Compra efetuada!');
    } catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;