//yfv4g92BIVgV8kkr
//kajolcreative


const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express());
 

app.get('/', (req, res) => {
  res.send('Server is runnning')
})

// monogo setup 

const uri = "mongodb+srv://kajolcreative:yfv4g92BIVgV8kkr@kajolcreative.iovdjjt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
  // perform actions on the collection object
  console.log("mongoConnected");
 

async function dbConncet () {
  try {
  const serviceCollection = client.db("kajolCreative").collection("services");

         app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
            console.log(result);
             
        });
        app.get("/services", async(req, res) => {
      const size = parseInt(req.query.size)
      console.log(size);
      
      const query = {};
       const cursor = serviceCollection.find(query);
       
       const service = await cursor.limit(size).toArray();
      //  const count = await serviceCollection.estimatedDocumentCount();
       res.send( {service});
       
    });
        app.get('/services/:id', async (req, res) => {
          const id = req.params.id;
          console.log(id);
          const query = {_id : ObjectId(id)};
          const service = await serviceCollection.findOne(query);
          res.send(service);
        })

  
} catch (error) {
  console.log(error.name, error.message);
  
}

}
dbConncet().catch(err => console.log(err.name, err.message))





app.listen(port, () => {
  console.log(`kajolcreative server listening on port ${port}`)
})