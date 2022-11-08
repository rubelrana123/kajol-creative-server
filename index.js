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

app.listen(port, () => {
  console.log(`kajolcreative server listening on port ${port}`)
})