const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()
require('dotenv').config()
//Middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxzfht6.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});




async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        const database = client.db('Coffee-Item')
        const Coffee = database.collection('Coffees')
        const CoffeeUser = database.collection('User')
        //Create Coffee 
        app.post('/coffees', async (req, res) => {
            const coffee = req.body
            // console.log(coffee)
            const result = await Coffee.insertOne(coffee)
            res.send(result)
        })
        // Database to ser ver
        app.get('/coffees', async (req, res) => {
            const cursor = Coffee.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        //Coffee Details
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await Coffee.findOne(query)
            res.send(result)
        })

        //Delete a Coffee
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id
            console.log('please delete', id)
            const query = { _id: new ObjectId(id) }
            const result = await Coffee.deleteOne(query)
            res.send(result)
        })
        //Update Coffee
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id
            const coffee = req.body
            console.log(id, coffee)
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const UpdateCoffee = {
                $set: {
                    name: coffee.name,
                    quantity: coffee.quantity,
                    supplier: coffee.supplier,
                    ingredients: coffee.ingredients,
                    price: coffee.price,
                    details: coffee.details,
                    photo: coffee.photo
                }
            }
            const result = await Coffee.updateOne(filter, UpdateCoffee, options)
            res.send(result)
        })
        //Create User Through Firebase
        app.post('/user', async (req, res) => {
            const user = req.body
            console.log(user);
            const result = await CoffeeUser.insertOne(user)
            res.send(result)
        })
        //User From Database to server
        app.get('/user', async (req, res) => {
            const cursor = CoffeeUser.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        //Update User
        app.get('/user/:email', async(req,res) =>{
            const id = req.params.email
            // console.log(id)
            const query = {email: id}
            // console.log(query)
            const result = await CoffeeUser.findOne(query)
            // console.log(result)
            res.send(result)
        })
        app.put('/user/:email', async(req, res) =>{
            const id = req.params.email
            const user = req.body
            const filter = {email: id}
            const options = {upsert: true}
            const UpdateUser = {
                $set:{
                    LastSignIn:user.LastSignIn
                }
            }
            const result = await CoffeeUser.updateOne(filter, UpdateUser, options)
            res.send(result)
        })
        
        // Send a ping to confirm a successful connection

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('I am A HArd Worker Person')
})
app.listen(port, () => {
    console.log('App listing on Port:', port)
})