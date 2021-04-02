const mongoose = require ('mongoose');
const validator = require ('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ForbiddenPasswords = ['pw', 'pass', 'password'];
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        validate(value) {
            if(value < 0) throw new Error("A idade tem que ser superior a 0");
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Introduza um email válido");
            }
        },
        lowercase: true,
        minLength: 7,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(ForbiddenPasswords.includes(value)) {
                throw new Error("Introduza uma palavra passe válida!");
            }
        }
    },
    role: {
        type: String,
        default: "player"
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
        timestamps: true
});

userSchema.virtual('cart', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'owner',
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if(!user) {
        throw new Error('Não é possível efetuar o login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Pw errada');
    }

    return user;
}

userSchema.methods.getPublicProfile = function() {
    const user = this;
    const userObject = user.toObject();


    delete userObject.password;
    delete userObject.role;
    delete userObject._id;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, 'vanesecret123');
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.pre('save', async function(next) {
    const user = this;
    
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;