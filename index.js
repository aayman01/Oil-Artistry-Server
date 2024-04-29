const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle milware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrbh57q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const artsAndCraftCollection = client
      .db("ArtsCraftsDB")
      .collection("artscraft");
    const artsAndCraftCategories = client.db("ArtsCraftsDB").collection("data");

    app.get("/artcraft", async (req, res) => {
      const cursor = artsAndCraftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/artcraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artsAndCraftCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/subcategory", async(req, res) => {
      const cursor = artsAndCraftCategories.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/craft/:customization", async (req, res) => {
      const customization = req.params.customization;
      const query = {customization :customization }
      const result = await artsAndCraftCollection.find(query).toArray();
      res.send(result)
    });


    app.get("/mycraft/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email)
      const query = { user_email: email };
      const result = await artsAndCraftCollection.find(query).toArray();
      res.send(result);
    });
    

    app.post("/artcraft", async (req, res) => {
      const newData = req.body;
      const result = await artsAndCraftCollection.insertOne(newData);
      res.send(result);
    });

    app.put("/artcraft/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsart: true };
      const updatedData = {
        $set: {
          item_name: data.item_name,
          short_description: data.short_description,
          subcategory_Name: data.subcategory_Name,
          price: data.price,
          photoUrl: data.photoUrl,
          customization: data.customization,
          rating: data.rating,
          status: data.status,
          processing_time: data.processing_time,
        },
      };
      const result = await artsAndCraftCollection.updateOne(
        filter,
        updatedData,
        option
      );
      res.send(result);
    });

    app.delete("/artcraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artsAndCraftCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("OilArtistry server is running...");
});

app.listen(port, () => {
  console.log(`My server is running on ${port}`);
});
