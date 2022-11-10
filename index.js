//yfv4g92BIVgV8kkr
//kajolcreative


const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');

require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is runnning')
})

// monogo setup 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_USER}.iovdjjt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
 function verifyJWT(req, res, next){
     const authHeader = req.headers.authorization;
     if(!authHeader) {
      return res.status(401).send({message : "unauthorize access"})
     }
     const token = authHeader.split(' ')[1];
     jwt.verify(token, process.env.JWT_ACCESS_TOKEN, function(err, decoded) {
      if(err) {
      return res.status(401).send({message : "unauthorize access"})

      }
      req.decoded = decoded;
      next();
     })
}


 

async function dbConncet () {
  try {
  const serviceCollection = client.db("kajolCreative").collection("services");
  const reviewCollection = client.db("kajolCreative").collection("reviews");

    app.post("/jwt", (req, res) => {
       const user = req.body
       console.log(user);
       const token = jwt.sign(user, process.env.JWT_ACCESS_TOKEN, {expiresIn: '10day'})  
       res.send({token});
     })
 

      app.post("/services", async(req, res) => {
        const service = req.body;
        // console.log(result);
        const result = await serviceCollection.insertOne(service);
         res.send(result);
         console.log(result);
      })

        app.get("/services", async(req, res) => {
          
          const query = {};
          if(req.query.size) {
             const size = parseInt(req.query.size)
            console.log(size);
            
            const cursor = serviceCollection.find(query).hint( { $natural : -1 } );
            
            const service = await cursor.limit(size).toArray();
            //  const count = await serviceCollection.estimatedDocumentCount();
            res.send( {service});

          }
          else {
             const cursor = serviceCollection.find(query);
            
            const service = await cursor.toArray();
            //  const count = await serviceCollection.estimatedDocumentCount();
            res.send( {service});

          }
     
       
    });
        app.get('/services/:id', async (req, res) => {
          const id = req.params.id;
          console.log(id);
          const query = {_id : ObjectId(id)};
          const service = await serviceCollection.findOne(query);
          res.send(service);
        })

  app.post("/reviews", async(req, res) => {


       const review = req.body;
        // console.log(result);
        const result = await reviewCollection.insertOne(review);
         res.send(result);
         console.log(result);
  })
app.get("/reviews",verifyJWT, async(req, res) => {
           const decoded = req.decoded;
           console.log(decoded);

          console.log(decoded);
          if(decoded.email !== req.query.email) {
             return res.status(401).send({message : "unauthorize access"})
            
          }
             let query = {}
              if(req.query.email) {
            query = {
              email : req.query.email
            }
          }
            const cursor = reviewCollection.find(query).sort ( { date: -1 } );
            const result = await cursor.toArray();
            res.send(result);
            // console.log(result);
    });
        app.get('/reviews/:id', async (req, res) => {
          const id = req.params.id;
          // console.log(id);
          const query = {serviceId : id};
         const cursor = reviewCollection.find(query);
        const result = await cursor.toArray();
        res.send(result)
        })
        app.get('/reviewsEdit/:id', async (req, res) => {
          const id = req.params.id;
          // console.log(id);
            const query = { _id: ObjectId(id) };
        
         const result = await reviewCollection.findOne(query);
        // const result = await cursor.toArray();
        res.send(result)
        })
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        app.patch("/reviews/:id", async(req, res) => {
          const { id } = req.params;
          // console.log("Patch",id);
          const updateDoc = {
            $set: {
              review:  req.body.review,
              date : req.body.date,
              rating : req.body.rating
            },
          };
          const result = await reviewCollection.updateOne({ _id: ObjectId(id) }, updateDoc);
          // res.send(result);
          console.log(result);
        })
 
  
} catch (error) {
  console.log(error.name, error.message);
  
}

}
dbConncet().catch(err => console.log(err.name, err.message))





app.listen(port, () => {
  console.log(`kajolcreative server listening on port ${port}`)
})