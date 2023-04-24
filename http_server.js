const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
const path = require('path');
const app = express();

//replace with our  mongoDB connectiom string VVV
const uri = "mongodb+srv://battleshipManager:1yT26ZvAdzJ1D7IN@cluster0.rmefqf2.mongodb.net/battleshipDb";


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'html')));

app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    //replace with our mongodb database name v v
    const db = client.db('battleshipDb');
    const users = db.collection('users');

    const user = await users.findOne({username, password});

    if(user) {
      
      res.redirect('/gamepage.html');
    
    } else {
      res.status(401).send('Incorrect username or password');
    }

    client.close();
  } catch (error) {
    console.error('Error connecting to the database', error);
    res.status(500).send('Internal server error');
  }
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.post('/register', async (req, res) => {
  const {username, password, email} = req.body;

  try {
    const client = await MongoClient.connect(uri, { usenewUrlParser: true, useUnifiedTopology: true});
    const db = client.db('battleshipDb');
    const users = db.collection('users');

    //insert new user to battleship user collection
    const existingUser = await users.findOne({ $or: [{username }, { email}] });

    if (existingUser) {
      //if username or email already exists, send an error
      res.status(409).send("Username or email already exists. <br><a href='/'>Go back</a>");
      
    } else {
      await users.insertOne({username, password, email});
      client.close();
      //if username/email doesnt exist Creates account
      res.redirect('/gamepage.html');
    }



   
  } catch(error) {
    console.error('Error connecting to the database', error);
    res.status(500).send('Internal Server Error');
  }

});
app.post('/leaderboard', async (req, res) => {

  try {
    const client = await MongoClient.connect(uri, { usenewUrlParser: true, useUnifiedTopology: true});
    const db = client.db('battleshipDb');
    const users = db.collection('users');

    // finds users in descending orders
    const sort = { wins: -1 };
    const query = {};

    userarray = users.find().sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
    document.getElementById('user').innerHTML = userarray[0].username;


  } catch(error) {
    console.error('Error connecting to the database', error);
    res.status(500).send('Internal Server Error');
  }
});