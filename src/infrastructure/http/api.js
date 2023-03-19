const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const RegisterUser = require('../../application/registerUser');
const UserRepository = require('../../domain/userRepository');

mongoose.connect('mongodb://mongo:27017/TheRickAndMortyDatabaseDemo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('Connected to MongoDB');
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/users', async (req, res) => {
  try {
    const registerUser = new RegisterUser(new UserRepository());
    const user = await registerUser.execute(req.body);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  process.stdout.write(`Server listening on port: ${port}`);
});
