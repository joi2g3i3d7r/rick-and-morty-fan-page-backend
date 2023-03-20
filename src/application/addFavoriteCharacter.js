class AddFavoriteCharacter {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, favoriteCharacter) {
    return this.userRepository.addFavoriteCharacter(userId, favoriteCharacter);
  }
}

module.exports = AddFavoriteCharacter;
