const express = require('express')
const cors = require('cors')
var jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{

    res.send('Hello bubu from node')
})


// mongdb



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0vh6mry.mongodb.net/?retryWrites=true&w=majority`;


const uri = `mongodb+srv://${process.env.DEMO_USER}:${process.env.DEMO_PASS}@cluster0.0vh6mry.mongodb.net/test`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async()=>{
    
    try{
        const servicesCollection = client.db("lawyerDb").collection("services");

        app.get('/services', async(req,res)=>{

            const query = {}
            const limit = parseInt(req.query.limit)

            const cursor = servicesCollection.find(query).sort({_id:-1})

            const result = await cursor.limit(limit).toArray()
            res.send(result)
        })

        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id

            const query = {_id:ObjectId(id)}

            const result = await servicesCollection.findOne(query)

            console.log(result)
            res.send(result)
        })

        





    }
    finally{

    }

}
run().catch(console.dir)







app.listen(port,()=>{

    console.log(`listing from ${port}`)
})