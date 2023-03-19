class RegisterUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(user) {
    const [existingUserByEmail, existingUserByNickname] = await Promise.all([
      this.userRepository.findByEmail(user.email),
      this.userRepository.findByNickname(user.nickname),
    ]);

    if (existingUserByEmail) {
      throw new Error('Email already in use');
    }

    if (existingUserByNickname) {
      throw new Error('Nickname already in use');
    }

    return this.userRepository.save(user);
  }
}

module.exports = RegisterUser;
