const express = require('express');
const Item = require('../models/item')
const router = new express.Router();
const Variant = require('../models/variant');
const logged = require('../middleware/logged');
const Anon = require('../models/anon');
const Cart = require('../models/cart');
const session = require('express-session');
const { response } = require('express');

// POST de um novo Item/Carrinho
// LOGGED Middleware devolve o user loggado ou a session caso não tenha login
router.post("/item", logged, async (req, res) => {
    const variant = await Variant.findOne({ _id: req.body.variantId });

    // Verifica o Login/Session que o Middleware devolveu
    if (req.user) {
        // Verifica se tem token, se não tiver significa que não tem login feito, seguindo a logica
        // do Middleware. E então passa a guardar a Session na DB que depois seria removida com um cronjob suponho
        // O primeiro  carrinho fica associado a esta session
        
        if (!req.token) {
            // Verifica se já tem a sessão guardada na DB
            const checkAnon = await Anon.findOne({ sessionID: req.sessionID });

            // Se não tiver sessão guarda, guarda.
            if (!checkAnon) {
                const anon = new Anon({ sessionID: req.sessionID });

                try {
                    await anon.save();
                } catch (e) {
                    return res.status(400).send('Não foi possível adicionar ao carrinho, tente mais tarde');
                }
            }
        }
    } else return res.status(200).send('Não foi possível adicionar ao carrinho, porfavor tente mais tarde.');

    let hasCart = await Cart.findOne({ owner: req.user._id });

    // Verifica se o User/Session tem já um Carrinho associado. Se não tiver, cria um
    if (!hasCart) {
        const newCart = await Cart({
            owner: req.user._id
        });

        try {
            hasCart = await newCart.save();
        } catch (e) {
            return res.status(400).send(e);
        }
    }

    // Verifica se tem stock, se tiver dá seguimento e retira do stock, se não tiver devolve erro
    if ((variant.qnt - req.body.qnt) < 0) {
        return res.status(400).send('Não existe stock para o produto pretendido');
    } else {
        await variant.updateOne({ "$inc": { "qnt": -req.body.qnt } });
    }

    // Cria uma nova entrada para a tabela de Item/Carrinho
    const item = await Item({
        ...req.body,
        cartId: hasCart._id,
    });

    try {
        const newItem = await item.save();
        res.status(201).send(newItem);
    } catch (e) {
        res.status(400).send(e);
    }
})

// DELETE de todos os items do carrinho do User/Session
// Optei por apagar todos os items do carrinho ao inves de apagar o carrinho em si, porque depois iria de ter de
// apagar todos os items associados ao carrinho em questão..
router.delete("/items/all", logged, async (req, res) => {
    try {
        if (!req.user) return res.status(400).send('Não foi possível a operação');

        const userCart = await Cart.findOne({ owner: req.user._id });
        if (!userCart) {
            res.status(400).send('Não foi possível a operação pretendida, tente mais tarde.');
        }

        // Apagar todos os registos associados ao Cart
        const items = await Item.deleteMany({ cartId: userCart._id });

        // Aqui verifico se o contador de delete do mongoDB é superior a 0, ou neste caso se não é false
        if (!items.deletedCount) {
            return res.status(200).send('Não existe produtos a remover');
        }
        res.status(200).send(items);
    } catch (e) {
        res.status(400).send(e);
    }
});

// DELETE de um item do carrinho do User/Session
router.delete("/item/:id", logged, async (req, res) => {
    try {
        // Verifica se tem sessão, se não tiver sessão, não deixa remover, sendo que o item fica no limbo
        // até um cronjob remover o produto ou verificar se a sessão que tem o produto continua válido, suponho..
        if (!req.user) {
            return res.status(400).send('Não foi possível a operação pretendida.');
        }

        const item = await Item.findOneAndRemove({ _id: req.params.id });

        if (!item) {
            return res.status(400).send('O Produto que está a tentar remover, não existe');
        }
        res.status(200).send(item);
    } catch (e) {
        res.status(400).send(e);
    }
});

// PATCH de um item do carrinho do User/Session (apenas na quantidade) e verifica o stock da variante
router.patch("/item/:id", logged, async (req, res) => {
    
    if (!req.user) {
        return res.status(400).send('Não foi possível a operação pretendida.');
    }

    const update = Object.keys(req.body);
    const allowedUpdates = 'qnt';
    const isValidOperation = allowedUpdates !== update;

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Update inválidos!' });
    }

    try {
        const item = await Item.findOne({ _id: req.params.id });

        if (!item) {
            return res.status(404).send('Não foi possível alterar o producto em questão');
        }

        const variant = await Variant.findOne({ _id: item.variantId });

        // Verifica se tem stock, se tiver dá seguimento e retira do stock, se não tiver devolve erro
        if ((variant.qnt - req.body.qnt) < 0) {
            return res.status(400).send('Não existe stock para o produto pretendido');
        } else {
            await variant.updateOne({ "$inc": { "qnt": -req.body.qnt } });
        }

        // Define a atualização da quantidade no carrinho
        item.qnt = req.body.qnt;

        // Guarda o pedido do carrinho com a nova quantidade
        await item.save();
        res.send(item);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;