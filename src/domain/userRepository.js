const User = require('./user');

class UserRepository {
  async save(user) {
    const newUser = new User(user);
    return newUser.save();
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findByNickname(nickname) {
    return User.findOne({ nickname });
  }
}

module.exports = UserRepository;
