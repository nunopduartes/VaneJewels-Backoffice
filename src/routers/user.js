const express = require('express');
const router = new express.Router();
const User = require('../models/user')
const auth = require ('../middleware/auth');
const Cart = require('../models/cart');
const { sendWelcomeMail} = require('../emails/account');

// POST do Login do user, tendo em conta o carrinho da SESSION, caso tenha, passa a ser esse o carrinho do user
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        /* Verificar se a sessão já tem um carrinho associado com items,
        se tiver, esse carrinho passa a ter como owner o _id deste user loggado.
        Isto para não perder o carrinho que fez sem o login */
        const sessionCart = await Cart.findOne({owner: req.sessionID});
        if(sessionCart) {
            /* Seria interessante fazer merge de ambos os carrinhos
            Pois desta forma ele acaba por perder o carrinho caso tivesse carrinho no Login
            Mas dados os casos de uso, penso que por norma é este o flow de um user num site de compras */
            await Cart.findOneAndRemove({owner: user._id});
            await sessionCart.updateOne({owner: user._id});
        }
        return res.send({user: user.getPublicProfile(), token});
    } catch(e) {
        return res.status(500).send({error: 'Credenciais Inválidas!'});
    }
});

// POST do registo do user na DB e envio de email boas vindas.
router.post("/user/register", async (req, res) => {

    if(req.body.role) return res.status(400).send("Não tens permissões para a operação.");
    
    const user = new User(req.body);

    try {
        //if(await User.find({email: req.body.email})) throw new Error('Email já em uso, porfavor escolha outro');
        await user.save();
        sendWelcomeMail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(e){
        if(e.keyValue.email) e = {msg: 'Email já em uso.'};
        res.status(400).send(e);
    }
});

// PATCH da info do User a ser atualizada (das permitidas)
router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Update inválidos!'});
    }

    try {
        updates.forEach((key) => req.user[key] = req.body[key]);
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('Logout efectuado em todos os dispositivos.');
    } catch(error) {
        res.status(400).send({error: "Não foi possível fazer o logout de todos os dispositivos"});
    }
})

// POST do Logout do user num determinado dispositivo
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.status(200).send("Logout efetuado.");
    } catch {
        res.status(400).send({error: "Não foi possível fazer logout."})
    }
});


// GET do perfil do user loggado, com os campos publicos definidos previamente
router.get("/users/me", auth, async (req, res) => {
    try {
        res.send({user: req.user.getPublicProfile()});
    } catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;