const express = require('express');
const router = new express.Router();
const Variant = require('../models/variant');
const permissions = require('../middleware/permission');

// POST de uma nova variante de um produto, se tiver permissões
router.post("/variant", permissions, async(req, res) => {
    const variant = await Variant({
        ...req.body,
    });
    
    try {
        const newVariant = await variant.save();
        res.status(201).send(newVariant);
    } catch(e) {
        res.status(400).send(newVariant);
    }
});

// DELETE de uma variante de um produto, se tiver permissões
router.delete("/variant/:id", permissions, async(req, res) => {
    try {
        const variant = await Variant.findByIdAndRemove(req.params.id);
        if(!variant) {
            return res.status(400).send('Não existe a variante.');
        }
        res.status(200).send(variant);
    } catch(e) {
        res.status(400).send(e);
    }
})

// PATCH de uma variante de um produto, se tiver permissões, e se tiver os updates permitidos
router.patch("/variant/:id", permissions, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['color', 'material', 'size', 'qnt'];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Update inválidos!'});
    }

    try {
        const variant = await Variant.findOne({_id: req.params.id})

        if(!variant) {
            return res.status(404).send();
        }

        updates.forEach((key) => variant[key] = req.body[key]);
        await variant.save();
        res.status(200).send(variant);
    } catch(e) {
        res.status(400).send(e);
    }
});

// GET de uma variante em especifico
router.get("/variant/:id", permissions, async (req, res) => {
    try {
        const variant = await Variant.findOne({_id: req.params.id});
        if(!variant) {
            return res.status(404).send('Variante não encontrada');
        }
        res.status(200).send(variant);
    } catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;