const mongoose = require ('mongoose');

const connectionURL = 'mongodb://127.0.0.1:27017/vane-jewels';

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});