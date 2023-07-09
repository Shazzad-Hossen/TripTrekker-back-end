const express= require('express');
const cors= require('cors');
const port= process.env.PORT || 5000;
const app= express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://shazzadsrv:NcWApKBJNFwcGspo@cluster0.gaslm7s.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

//MiddleWare
app.use(cors());
app.use(express.json());



async function run() {
  try {
    await client.connect();
    const database = client.db("TripTrekker");
    const usersCollection = database.collection("users");

    //create user
    app.post('/user', async(req,res)=>{
        const data=req.body;
        const query = { email: data.email };
        const findRes = await usersCollection.findOne(query);
        if(findRes){
            res.send({"acknowledged":true, "user":findRes});
            return;
        }
        const result = await usersCollection.insertOne(data);
        const resultData = await usersCollection.findOne(query);
        res.send({...result,"user":resultData});   
    });

    app.get('/user/:email',async(req,res)=>{
        const query = { email: req.params.email };
        const result = await usersCollection.findOne(query);
        res.send(result);
    
    })







   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Backend is running');
});

app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);

})