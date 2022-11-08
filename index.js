//yfv4g92BIVgV8kkr
//kajolcreative


const express = require('express')
const app = express()
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express());
 

app.get('/', (req, res) => {
  res.send('Server is runnning')
})

// monogo setup 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://kajolcreative:yfv4g92BIVgV8kkr@kajolcreative.iovdjjt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
  // perform actions on the collection object
  console.log("mongoConnected");
 

async function dbConncet () {
  try {
  const serviceCollection = client.db("kajolCreative").collection("services");

         app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
             
        });
        // app.get('/services/:id', async (req, res) => {
        //   const id = req.params.id;
        //   const query = {_id : ObjectId(id)};
        //   const service = await serviceCollection.findOne(query);
        //   res.send(service);
        // })

  
} catch (error) {
  console.log(error.name, error.message);
  
}

}
dbConncet();





app.listen(port, () => {
  console.log(`kajolcreative server listening on port ${port}`)
})