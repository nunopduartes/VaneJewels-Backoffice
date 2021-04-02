const mongoose = require ('mongoose');

const connectionURL = 'mongodb+srv://vanejewels:mGrqZZrI5NsiD698@cluster0.5qyhv.mongodb.net/test';

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});