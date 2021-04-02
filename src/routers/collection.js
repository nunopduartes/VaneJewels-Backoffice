const express = require('express');
const Collection = require('../models/collection')
const router = new express.Router();
const permissions = require('../middleware/permission');

//POST da coleção, cria um novo document.
//PERMISSIONS verifica o "Role" do user loggado, se for 'master' consegue efetuar a alteração pretendida.

router.post("/collection", permissions, async(req, res) => {
    const collection = await Collection({
        ...req.body,
    });
    
    try {
        const newCollection = await collection.save();
        res.status(201).send(newCollection);
    } catch(e) {
        res.status(401).send(e);
    }
});

// PATCH da coleção, com permissões, às keys do objeto json e verifica se são permitidos no allowedUpdates
router.patch("/collection/:id", permissions, async(req, res) => {
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Update inválidos!'});
    }

    try {
        const collection = await Collection.findById(req.params.id);

        if(!collection) {
            return res.status(404).send("A coleção não existe.");
        }

        updates.forEach((key) => collection[key] = req.body[key]);
        await collection.save();
        res.send(collection);
    } catch(e) {
        res.status(400).send(e);
    }
});

// DELETE da coleção, com permissões
router.delete("/collection/:id", permissions, async(req, res) => {    
    try {
        const collection = await Collection.findOneAndRemove({_id: req.params.id});

        if(!collection) {
            res.status(404).send('Não foi encontrada a coleção.');
        }
        res.status(200).send(collection);
    } catch(e) {
        res.status(404).send({error: 'Não foi possível remover a coleção indicada'});
    }
});

module.exports = router;