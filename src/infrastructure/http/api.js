const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RegisterUser = require('../../application/registerUser');
const ListUsers = require('../../application/listUsers');
const UserMongoRepository = require('../database/userMongoRepository');
const config = require('../config/config');
const UpdateUser = require('../../application/updateUser');
const AddFavoriteCharacter = require('../../application/addFavoriteCharacter');
const ListFavoriteCharacters = require('../../application/listFavoriteCharacters');

mongoose.connect('mongodb://localhost:27017/TheRickAndMortyDatabaseDemo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  process.stderr.write(`MongoDB connection error: ${error}\n`);
});

db.once('open', () => {
  process.stdout.write('Connected to MongoDB\n');
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  try {
    const { fullname, email, nickname, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const registerUser = new RegisterUser(new UserMongoRepository());

    await registerUser.execute({
      fullname,
      nickname,
      email,
      password: hashedPassword,
    });

    res.status(201).send({
      status: 201,
      message: 'Created',
    });
  } catch (error) {
    process.stderr.write(`${error.stack}\n`);
    res.status(500).send(error.message);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const listUsers = new ListUsers(new UserMongoRepository());
    const user = await listUsers.findByEmail(email);

    if (!user) {
      return res.sendStatus(404);
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      return res.status(401).send({
        status: 401,
        message: 'Password mismatch',
      });
    }

    const payload = {
      claims: {
        id: user.id,
        fullname: user.fullname,
        nickname: user.nickname,
      },
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

    res.send({
      status: 200,
      message: 'Authentication successful',
      accessToken: token,
    });
  } catch (error) {
    process.stderr.write(`${error.stack}\n`);
    res.status(500).send(error.message);
  }
});

app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullname, nickname } = req.body;
    const updatedUser = new UpdateUser(new UserMongoRepository());

    await updatedUser.execute(userId, {
      fullname,
      nickname,
    });

    res.send({
      status: 200,
      message: 'Updated successful',
    });
  } catch (error) {
    process.stderr.write(`${error.stack}\n`);
    res.status(500).send(error.message);
  }
});

app.post('/api/users/:userId/favorite-characters', async (req, res) => {
  try {
    const { userId } = req.params;
    const favoriteCharacter = req.body;
    const addFavoriteCharacter = new AddFavoriteCharacter(new UserMongoRepository());
    await addFavoriteCharacter.execute(userId, favoriteCharacter);

    res.send({
      status: 200,
      message: 'Favorite character added successful',
    });
  } catch (error) {
    process.stderr.write(`${error.stack}\n`);
    res.status(500).send(error.message);
  }
});

app.get('/api/users/:userId/favorite-characters', async (req, res) => {
  try {
    const { userId } = req.params;
    const getAllFavoriteCharacters = new ListFavoriteCharacters(new UserMongoRepository());
    const listFavoriteCharacters = await getAllFavoriteCharacters.execute(userId);

    res.send({
      status: 200,
      message: 'success',
      listFavoriteCharacters,
    });
  } catch (error) {
    process.stderr.write(`${error.stack}\n`);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  process.stdout.write(`Server listening on port: ${port}\n`);
});
