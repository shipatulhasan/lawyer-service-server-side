const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{

    res.send('Hello bubu from node')
})


// mongdb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0vh6mry.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });









app.listen(port,()=>{

    client.connect(err => {
        // const collection = client.db("test").collection("devices");
        console.log('connected to mongodb')
        // perform actions on the collection object
        client.close();
      });


    console.log(`listing from ${port}`)
})