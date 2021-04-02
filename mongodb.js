const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017'

const databaseName = 'vane-jewels';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log('Error', error);
    }

    console.log("Ligação à DB Ok!");
    /*const db = client.db(databaseName);

    db.collection('products').insertOne({
        name: 'Ring',
        size: 6,
        color: 'Rose Gold',
        material: 'Silver',
    })*/
});