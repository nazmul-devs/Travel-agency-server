const express = require("express");
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// mongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f4mgp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const database = client.db("TravelAgency");
		const blogsCollection = database.collection("blogs");

		// Add service
		app.post("/blog", async (req, res) => {
			const blog = req.body;
			const result = await blogsCollection.insertOne(blog);
			res.json(result);
		});

		// Get blogs
		app.get("/blogs", async (req, res) => {
			const result = await blogsCollection.find({}).toArray();
			res.send(result);
		});

		// delete blog by id
		app.delete("/blogs", async (req, res) => {
			const id = req.body.id;
			const query = { _id: ObjectId(id) };
			const result = await blogsCollection.deleteOne(query);
			res.json(result);
		});

		// update blog
		app.put("/blogs/:id", async (req, res) => {
			const id = req.params.id;
			console.log(id);
			const filter = { _id: ObjectId(id) };
			const option = { upsert: true };
			const updatedDoc = req.body;
			const result = await blogsCollection.updateOne(
				filter,
				updatedDoc,
				option
			);
			res.json(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

// get app
app.get("/", (req, res) => {
	res.send("Travel agency server is running");
});

// lisening app
app.listen(port, () => {
	console.log("Travel agency server running with ", port);
});
