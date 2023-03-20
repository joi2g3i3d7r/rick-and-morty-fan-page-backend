class ListFavoriteCharacters {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, favoriteCharacter) {
    return this.userRepository.getAllFavoriteCharacters(userId, favoriteCharacter);
  }
}

module.exports = ListFavoriteCharacters;
