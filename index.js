const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n30la.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('tourService');
        const serviceCollection = database.collection('tourServiceDetails');
        const selectedCollection = database.collection('individiulSelectedService');
        // GET API 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })
        app.get('/myorders', async (req, res) => {
            const cursor = selectedCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })
        app.get('/manage-all-orders', async (req, res) => {
            const cursor = selectedCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service)
        })
        // GET SELETECTED ITEM API 
        app.get('/myorders/:userEmail', async (req, res) => {
            const email = req.params.userEmail;
            const cursor = selectedCollection.find({});
            const services = await cursor.toArray();
            const selectService = services.filter(service => service.userEmail == email);
            res.json(selectService);
        })
        // POST API
        app.post('/addingnewServices', async (req, res) => {
            const result = await serviceCollection.insertOne(req.body);
            res.json(result);
        });
        // POST API
        app.post('/addServices', async (req, res) => {
            const result = await selectedCollection.insertOne(req.body);
            res.json(result);
        });
        // DELETE SINGLE SERVICE 
        app.delete('/myorders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleting user with', id);
            const query = { _id: ObjectId(id) };
            const result = await selectedCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        });
        app.delete('/manage-all-orders/:id', async (req, res) => {
            const result = await selectedCollection.deleteOne({ _id: ObjectId(req.params.id) });
            console.log(result);
            res.json(result);
        })
    }
    finally {
        // await client.close();   
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.json('Hello form');
})
app.listen(port, () => {
    console.log('running on port', port);
})