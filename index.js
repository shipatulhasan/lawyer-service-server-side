const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello bubu from node");
});


const varifyJWT = (req,res,next)=>{
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(401).send({message:'unauthorized access'})
  }
  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
    if(err){
      return res.status(401).send({message:'unauthorized access'})
    }
    req.decoded = decoded
    next()
  })
  
}

// mongdb

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0vh6mry.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DEMO_USER}:${process.env.DEMO_PASS}@cluster0.0vh6mry.mongodb.net/test`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const servicesCollection = client.db("lawyerDb").collection("services");
    const reviewCollection = client.db("lawyerDb").collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      const limit = parseInt(req.query.limit);

      const cursor = servicesCollection.find(query).sort({ _id: -1 });

      const result = await cursor.limit(limit).toArray();
      res.send(result);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await servicesCollection.findOne(query);

      res.send(result);
    });


    app.post('/jwt',async(req,res)=>{
      const user = req.body
      const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1h'})
      res.send({token})
    })

    // Review

    app.post("/review", async (req, res) => {
      const comment = req.body;
      const result = await reviewCollection.insertOne(comment);
      res.send(result);
      console.log(result);
    });
    app.get("/review",varifyJWT, async (req, res) => {

      const decoded = req.decoded
      const verification = decoded.currentUser
      const email = req.query.email;

      if(verification.email!== email){
        return res.status(403).send({message:'forbidden'})
      }

      const query = {email:email}
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
      
    });

    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { service_id: id };
      const cursor = reviewCollection.find(query).sort({ _id: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put('/review/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const comment = req.body.comment
      const updateComment = {
        $set:{
          comment:comment
        }
      }
      const result = await reviewCollection.updateOne(query,updateComment)
      res.send(result)
    })

    app.delete('/review/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await reviewCollection.deleteOne(query)
      res.send(result)
    })



  } finally {
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`listing from ${port}`);
});
