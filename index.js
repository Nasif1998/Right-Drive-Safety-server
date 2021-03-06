const express = require('express')
const cors = require('cors');
const fs = require('fs-extra');
// const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzaf0.mongodb.net/driCub?retryWrites=true&w=majority`;

const ObjectID = require('mongodb').ObjectID;
const app = express()

// app.use(express.static('services'));
// app.use(fileUpload());
const port = process.env.PORT || 9003;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("driCub").collection("services");
    const orderCollection = client.db("driCub").collection("orders");
    const adminCollection = client.db("driCub").collection("admin");
    const reviewCollection = client.db("driCub").collection("reviews");
    console.log('db connected');
    


    app.post('/addAService', (req, res) => {
        const newBook = req.body;
        console.log(newBook);
        serviceCollection.insertOne(newBook)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.get('/checkout/:_id', (req, res) => {
        serviceCollection.find({ _id: ObjectID(req.params._id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order);
        orderCollection.insertOne(order)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/orderDetails', (req, res) => {
        orderCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.get('/bookings', (req, res) => {
        orderCollection.find({email: req.query.email})
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log(newAdmin);
        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log(newReview);
        reviewCollection.insertOne(newReview)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.get('/manageServices', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.delete('/deleteEvent/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectID(req.params.id) })
          .then(result => {
            res.send({ count: result.deletedCount > 0 });
            // res.redirect('/')
          })
    
        
      })

      app.delete('/deleteOrder/:id', (req, res) => {
        orderCollection.deleteOne({ _id: ObjectID(req.params.id) })
          .then(result => {
            res.send({ count: result.deletedCount > 0 });
            // res.redirect('/')
          })
    
        
      })

      app.get('/orderDetails/:id', (req,res) => {
        orderCollection.find({_id: ObjectID(req.params.id)})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.patch('/update/:id', (req, res) => {
        orderCollection.updateOne({_id: ObjectID(req.params.id)},
        {
            $set: {status: req.body.status}
        })
        .then(result => {
            // console.log(result);
            res.send(result.modifiedCount > 0);
        })
    })
});

