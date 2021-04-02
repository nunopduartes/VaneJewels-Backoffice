const express = require('express');
const Product = require('../models/product');
const Collection = require('../models/collection');
const router = new express.Router();
const permission = require('../middleware/permission');

// GET de todos os produtos da DB
router.get("/products/all", async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch(e) {
        res.status(400).send('Não foi possível obter os produtos.');
    }
});

// GET de um produto especifico da DB
router.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findOne({_id: req.params.id});
        if(!product) {
            return res.status(404).send('Produto não encontrado');
        }
        res.send(product);
    } catch(e) {
        res.status(400).send(e);
    }
});

// PATCH de um producto especifico da DB, com updates permitidos definidos, verifica se tem permissoes
router.patch("/product/:id", permission, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description'];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Update inválidos!'});
    }

    try {
        const product = await Product.findOne({_id: req.params.id})

        if(!product) {
            return res.status(404).send();
        }

        updates.forEach((key) => product[key] = req.body[key]);
        await product.save();
        res.status(200).send(product);
    } catch(e) {
        res.status(400).send(e);
    }
});

// DELETE de um produto, verifica se tem permissoes
router.delete("/product/:id", permission, async(req, res) => {
    try {
        const product = await Product.findOneAndRemove({_id: req.params.id});

        if(!product) {
            res.status(400).send('O Produto que está a tentar remover, não existe');
            return;
        }
        res.status(200).send(product)
    } catch(e) {
        res.status(400).send(e);
    }
})

// POST de um novo produto, se teive permissoes
router.post("/product", permission, async(req, res) => {
    const collection = await Collection.findOne({_id: req.body.collections});

    // verifica se a coleção existe, será sempre necessário um produto estar associado a uma coleção
    if(!collection) {
        return res.status(400).send('A coleção pretendida é inválida.');
    }

    const product = await Product({
        ...req.body,
    });
    
    try {
        const newProd = await product.save();
        res.status(201).send(newProd);
    } catch(e) {
        res.status(400).send(e);
    }
})

module.exports = router;