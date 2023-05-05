//APW Javascript Section 4 Anthony Pfau, Ahmed Kaced, Christopher Martinez, Christian Betia
const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
const path = require('path');
const session = require('express-session');
const app = express();



//replace with our  mongoDB connectiom string VVV
const uri = "mongodb+srv://battleshipManager:1yT26ZvAdzJ1D7IN@cluster0.rmefqf2.mongodb.net/battleshipDb";


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'html')));
app.use(session({
  secret: 'your_secret_key_here',
  resave: false,
  saveUninitialized: true,
}));


app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    //replace with our mongodb database name v v
    const db = client.db('battleshipDb');
    const users = db.collection('users');

    const user = await users.findOne({username, password});

    if(user) {
      req.session.username = username;
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
      const newUser = {
        username,
        password,
        email,
        wins: 0,
        losses: 0,
        totalShipsSunk: 0,
      };
      await users.insertOne(newUser);
      req.session.username = username;
      client.close();
      //if username/email doesnt exist Creates account
      res.redirect('/gamepage.html');
    }



   
  } catch(error) {
    console.error('Error connecting to the database', error);
    res.status(500).send('Internal Server Error');
  }

});

app.get('/getUsername', (req, res) => {
  res.send(req.session.username);
});

app.post('/updateWinLoss', async (req, res) => {
  const { username, winLoss } = req.body;

  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('battleshipDb');
    const users = db.collection('users');

    const updateResult = await users.updateOne(
      { username },
      { $inc: { [winLoss]: 1 } }
    );

    client.close();

    res.status(200).json(updateResult);
  } catch (error) {
    console.error('Error connecting to the database', error);
    res.status(500).send('Internal server error');
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