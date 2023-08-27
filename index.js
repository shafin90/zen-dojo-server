const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51NI6RJJlO98Mt1tpbV5uJwn1GRt9lDB2ypwuk8erS5oHxTJxuMNOD0NERGU6Wvr7OI4W7NH7Aq4vAHKj1tjUwWod00RshRSN5G');
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
        const selectedClassesCollection = client.db('zen-dojo').collection('selected_classes');
        const enrolledClassesCollection = client.db('zen-dojo').collection('enrolled_classes');
        const instructor_bio = client.db('zen-dojo').collection('instructor_bio');




        // user info getting api===================================================
        app.get('/gettingUserInfo', async (req, res) => {
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
        app.put('/updateUserInfo/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);

            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    status: user.status,

                }
            }

            const result = await userCollection.updateOne(filter, updatedUser, options);
            res.send(result);


        })




        // =========================pending class related api activities===============================================
        app.post('/pending_classes', async (req, res) => {
            const pending_class = req.body;
            console.log(pending_class);
            const result = await pendingClassesCollection.insertOne(pending_class);
            res.send(result);
        })



        app.get('/getting_pending_classes', async (req, res) => {
            const cursor = pendingClassesCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })






        // =======================approve class related api activities=================================================
        app.post('/approve_class', async (req, res) => {
            const approve_class = req.body;
            // console.log(pending_class)
            approve_class.classStatus = 'approved';
            const result = await approvedClassesCollection.insertOne(approve_class);
            res.send(result);
        })



        app.get('/getting_approved_classes', async (req, res) => {
            const cursor = approvedClassesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })



        // deleting the class from pending class as it has been included in the approved class
        app.delete('/delete_class_from_pending_class/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id) }

            const result = await pendingClassesCollection.deleteOne(query);
            res.send(result);
        })





        // =============================Deny class related api activities=======================================

        // api for deleting data from pending class as it is denied
        app.delete('/denied_from_pending_class/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id) }

            const result = await pendingClassesCollection.deleteOne(query);
            res.send(result);
        })

        // api for deleting data from approve class as it is denied
        app.delete('/denied_from_approved_class/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from  approve database', id);
            const query = { _id: (id) }

            const result = await approvedClassesCollection.deleteOne(query);
            res.send(result);
        })







        // ======================Selected class====================================================================
        app.post('/selected_class', async (req, res) => {
            const user = req.body;
            console.log('new user', user);
            const result = await selectedClassesCollection.insertOne(user);
            res.send(result);
        });
        app.get('/getting_selected_class', async (req, res) => {
            const cursor = selectedClassesCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/delete_class/:id', async(req, res) =>{
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: id}
            
            const result = await selectedClassesCollection.deleteOne(query);
            res.send(result);
        })


































        // =================stripe payment===============================================


        app.post('/process_payment', async (req, res) => {
            const {className , amount ,email} = req.body;

            // console.log('kaj kore', classId)
            try {
                // Fetch class details based on classId (you need to implement this logic)
                // const selectedClass = await fetchClassDetails(classId);

                // if (!selectedClass) {
                //     return res.status(404).json({ error: 'Class not found' });
                // }

                // Create a Stripe Payment Intent
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount,
                    currency: 'usd',
                    description: `Payment for ${className}`,
                    // metadata: { classId: selectedClass._id.toString() }
                });

                const result = await enrolledClassesCollection.insertOne({className,amount, email});

                // Send the Payment Intent client secret back to the client
                res.send(result);
            } catch (error) {
                console.error('Error processing payment:', error);
                res.status(500).json({ error: 'Payment processing failed' });
            }
        });

        app.get('/getEnrolledClasses', async (req, res) => {
            const cursor = enrolledClassesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })













        // ===========================================================================================================
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