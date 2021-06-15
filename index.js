const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
require('dotenv').config();
var moment = require('moment-timezone');
moment.tz.setDefault();

const port = 8800;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1xgou.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Hello World!')
})



client.connect(err => {
    const serviceCollection = client.db("webDeveloping").collection("addServices");
    const reviewCollection = client.db("webDeveloping").collection("addReview");
    const adminCollection = client.db("webDeveloping").collection("addAdmin");
    const appointmentCollection = client.db("webDeveloping").collection("addAppointment");


    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('Adding new book:', newService);
        serviceCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('Adding new Review:', newReview);
        reviewCollection.insertOne(newReview)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log('Adding new Admin:', newAdmin);
        adminCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    app.post('/addAppointment', (req, res) => {
        const newAppointment = req.body;
        console.log('Adding new Appointment:', newAppointment);
        appointmentCollection.insertOne(newAppointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/getService', (req, res) => {
        serviceCollection.find()
            .toArray((err, service) => {
                res.send(service);
            });
    });

    app.get('/getReviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, review) => {
                res.send(review);
            });
    });

    app.get('/appointmentForm/:serviceId', (req, res) => {
        serviceCollection.find({ serviceId: req.params.serviceId })
            .toArray((err, documents) => {
                res.send(documents[0]);
            });
    });

    app.get('/myBookingList', (req, res) => {
        const queryEmail = req.query.email;
        if (queryEmail) {
            appointmentCollection.find({ email: queryEmail })
                .toArray((err, documents) => {
                    res.send(documents);
                })
        }
        else {
            res.status(401).send('Unauthorized Access')
        }
    });

    app.get('/allAppointmentList', (req, res) => {
        const queryEmail = req.query.email;
        adminCollection.find({ email: queryEmail })
            .toArray((err, admins) => {
                if (admins.length == 0) {
                    res.status(401).send('Unauthorized Access');
                }
                else {
                    appointmentCollection.find({})
                        .toArray((err, appointments) => {
                            res.send(appointments);
                            console.log("All appointments", appointments)
                        })
                }
            })
    });


    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
                console.log('admin', admin)
            })
    })


    app.delete('/removeService/:serviceId', (req, res) => {
        serviceCollection.deleteOne({ serviceId: req.params.serviceId })
            .then(result => {
            })
    })

});

app.listen(process.env.PORT || port)