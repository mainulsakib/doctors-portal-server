const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvsvn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
const port = 5000
app.use(cors())
app.use(bodyParser.json())



console.log(process.env.DB_NAME,process.env.DB_PASS)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const appointmentCollection = client.db("doctorsPortal").collection("appointment");

  app.post('/addAppointment',(req, res)=>{
      const appointment = req.body;
      appointmentCollection.insertOne(appointment)
      .then(result =>{
          res.send(result.insertedCount>0)
      })
  })
  app.post('/appointmentByDate',(req, res)=>{
    const date  = req.body;
    console.log(date.date)
    const z=date.date.split('T')[0]
    console.log(z)
    appointmentCollection.find({})
    .toArray((err, document)=>{
        const result = document.filter(vl=>{
            const d=vl.date.split('T')[0]
            console.log(d,z) 
            if(d===z){
                return vl
            }
            
        })
        console.log(result)
        res.send(result)
    })
})
});


app.listen(process.env.port||port)