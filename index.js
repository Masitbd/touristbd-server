const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Database information

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ybdl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("connected to the database");
    const database = client.db("TouristDB");
    const servicesCollection = database.collection("services");

    // Get single service
    app.get("/services/:id", async (req, res) => {
      console.log("hits single record");
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };

      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    //Get api show all data
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //post Api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("Hit the post api", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });
  } finally {
    /*  await client.close(); */
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my crud server");
});

app.listen(port, () => {
  console.log("Running server on port", port);
});
