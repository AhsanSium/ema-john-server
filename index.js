const express = require('express')
const app = express()
const port = 5000
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
// const bodyParser = require(express.bodyParser());

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afifr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore1").collection("products");

  const ordersCollection = client.db("emaJohnStore1").collection("orders");

  app.post('/addProduct', (req, res) =>{
    const product = req.body;
    console.log(product);
    productsCollection.insertOne(product)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    })
  })

  app.get('/products', (req, res) =>{
    productsCollection.find({}).limit(20)
    .toArray((err , documents) =>{
      res.send(documents);
    })
  })

  app.get('/product/:key', (req, res) =>{
    productsCollection.find({key: req.params.key})
    .toArray((err , documents) =>{
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys/', (req, res)=> {
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err , documents)=> {
      res.send(documents);
    })
  })
  
  app.post('/addOrder', (req, res) =>{
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount > 0);
    })
    .catch(err => {
      console.log(err);
    });
  })

  // perform actions on the collection object
  console.log('Database Connected');
});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)


