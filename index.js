const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const bodyParser = require('body-parser');
const port = 5000


app.use(cors())
app.use(bodyParser.json());






// mongodb==========================================================================================


const uri = "mongodb+srv://mashrafiahnam:IOwrG4DoOlIGCD3G@cluster0.yhuz2xd.mongodb.net/?retryWrites=true&w=majority";

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
        // await client.connect();
        const userCollection = client.db('zen-dojo').collection('usersDB');
        const pendingClassesCollection = client.db('zen-dojo').collection('pending_classes');
        const approvedClassesCollection = client.db('zen-dojo').collection('approved_classes');




        // user info getting api===================================================
        app.get('/gettingUserInfo', async( req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })
    
    



    

        // user info storing api=============================
        app.post('/users', async (req, res) => {

            const user = req.body;
            console.log('new user', user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });




        // updating user information==========================
        app.put('/updateUserInfo/:id', async(req, res) =>{
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);
            
            const filter = {_id: new ObjectId(id)}
            const options = {upsert: true}
            const updatedUser = {
                $set: {
                    status: user.status,
                    
                }
            }
    
            const result = await userCollection.updateOne(filter, updatedUser, options );
            res.send(result);

    
        })




        // =========================pending class related api activities===============================================
        app.post('/pending_classes', async(req,res)=>{
            const pending_class = req.body;
            console.log(pending_class); 
            const result = await pendingClassesCollection.insertOne(pending_class);
            res.send(result);
        })



        app.get('/getting_pending_classes', async( req, res) => {
            const cursor = pendingClassesCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })






        // =======================approve class related api activities=================================================
        app.post('/approve_class', async(req,res)=>{
            const approve_class = req.body;
            // console.log(pending_class)
            approve_class.classStatus = 'approved';
            const result = await approvedClassesCollection.insertOne(approve_class);
            res.send(result);
        })

        
        
        app.get('/getting_approved_classes', async( req, res) => {
            const cursor = approvedClassesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        
        
        // deleting the class from pending class as it has been included in the approved class
        app.delete('/delete_class/:id', async(req, res) =>{
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id)}
            
            const result = await pendingClassesCollection.deleteOne(query);
            res.send(result);
        })



         


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



















app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})