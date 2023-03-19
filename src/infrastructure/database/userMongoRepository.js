const mongoose = require('mongoose');
const User = require('../../domain/user');

const UserMongoSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', UserMongoSchema);

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
}

module.exports = UserMongoRepository;
