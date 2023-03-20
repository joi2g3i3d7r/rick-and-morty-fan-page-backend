const mongoose = require('mongoose');
const User = require('../../domain/user');

const FavoriteCharacterSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: true,
  },
  origin: {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  location: {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  image: {
    type: String,
    required: true,
  },
  episode: {
    type: [String],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
});

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    favoriteCharacters: [FavoriteCharacterSchema],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', UserSchema);

class UserMongoRepository {
  async save(user) {
    const newUser = new UserModel(user);
    return newUser.save();
  }

  async findByEmail(email) {
    const record = await UserModel.findOne({ email });

    if (!record) {
      return null;
    }

    return new User(record._id, record.fullname, record.email, record.nickname, record.password);
  }

  async findByNickname(nickname) {
    const record = await UserModel.findOne({ nickname });

    if (!record) {
      return null;
    }

    return new User(record._id, record.fullname, record.email, record.nickname, record.password);
  }

  async getAll() {
    const users = await UserModel.find();

    return users.map(
      (record) =>
        new User(record._id, record.fullname, record.email, record.nickname, record.password)
    );
  }

  async update(userId, newUser) {
    return UserModel.findByIdAndUpdate(userId, newUser, { new: true });
  }

  async addFavoriteCharacter(userId, character) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const existingCharacter = user.favoriteCharacters.find(
      (favChar) => favChar.id === character.id
    );

    if (!existingCharacter) {
      user.favoriteCharacters.push(character);
      await user.save();
    }
  }

  async getAllFavoriteCharacters(userId) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.favoriteCharacters;
  }
}

module.exports = UserMongoRepository;
