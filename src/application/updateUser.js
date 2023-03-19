class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, newUser) {
    const existingUserByNickname = await this.userRepository.findByNickname(newUser.nickname);

    if (existingUserByNickname) {
      throw new Error('This nickname already exists');
    }

    await this.userRepository.update(userId, newUser);
  }
}

module.exports = UpdateUser;
