const User = require('../domain/user');

class ListUsers {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    return this.userRepository.getAll();
  }

  async findByEmail(email) {
    return this.userRepository.findByEmail(email);
  }
}

module.exports = ListUsers;
