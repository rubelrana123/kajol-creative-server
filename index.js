//yfv4g92BIVgV8kkr
//kajolcreative


const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const nodemon = require('nodemon');
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
 
  // perform actions on the collection object
  console.log("mongoConnected");
 

async function dbConncet () {
  try {
  const serviceCollection = client.db("kajolCreative").collection("services");
  const reviewCollection = client.db("kajolCreative").collection("reviews");

        //  app.get('/allservices', async (req, res) => {
        //     const query = {}
        //     const cursor = serviceCollection.find(query);
        //     const result = await cursor.toArray();
        //     res.send(result);
        //     console.log(result);
             
        // });

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
            
            const cursor = serviceCollection.find(query);
            
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
app.get("/reviews", async(req, res) => {
             let query = {}
              if(req.query.email) {
            query = {
              email : req.query.email
            }
          }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
            console.log(result);
    });
        app.get('/reviews/:id', async (req, res) => {
          const id = req.params.id;
          const query = {serviceId : id};
         const cursor = reviewCollection.find(query);
        const result = await cursor.toArray();
        res.send(result)
        })
            app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
  
} catch (error) {
  console.log(error.name, error.message);
  
}

}
dbConncet().catch(err => console.log(err.name, err.message))





app.listen(port, () => {
  console.log(`kajolcreative server listening on port ${port}`)
})