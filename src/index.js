const express = require('express');
require('./db/mongoose');
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');
const session = require('express-session');
const store = new session.MemoryStore();
const cookieParser = require('cookie-parser');

const userRouter = require('./routers/user');
const productRouter = require('./routers/product');
const collectionRouter = require('./routers/collection');
const cartRouter = require('./routers/cart');
const variantRouter = require('./routers/variant');
const itemRouter = require('./routers/item');

const app = express();
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
 
app.use(express.json());
app.use(express.static(publicPath));

app.use(cors());
app.use(cookieParser());

// Definições das Sessões no projeto, Secret, "Timeout" e outras propriedades

app.use(session({
    secret: 'vanejewel-key',
    cookie: { maxAge: 3000000 },
    resave: false,
    saveUnitialized: false,
    store
}));

// Session testing purposes
app.use('*',(req, res, next) => {
    next();
});

app.use(userRouter);
app.use(productRouter);
app.use(collectionRouter);
app.use(cartRouter);
app.use(variantRouter);
app.use(itemRouter);


app.use(express.urlencoded({ extended: true }));

hbs.registerPartials(partialsPath);

app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.listen(port, () => {
    console.log("O servidor iniciou.");
})

app.get('', (req, res, next) => {
    res.render('index.hbs', {
        title: 'VaneJewels',
    });
});