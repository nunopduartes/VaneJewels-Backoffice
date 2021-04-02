const jwt = require('jsonwebtoken');
const User = require('../models/user');

const permission = async (req, res, next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'vanesecret123');
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if(!user){
            throw new Error()
        }

        if(user.role !== 'master'){
            throw new Error()
        }

        req.user = user;
        req.token = token;
        
        next()
    } catch(e){
        res.status(401).send({error: 'Não tens permissões para a operação desejada.'})
    }
}

module.exports = permission;