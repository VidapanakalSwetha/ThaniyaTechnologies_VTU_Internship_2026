const axios = require("axios");

const fetchGitHubProfile = async (username) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);

    return {
      username: response.data.login,
      name: response.data.name,
      bio: response.data.bio,
      followers: response.data.followers,
      publicRepos: response.data.public_repos,
      avatar: response.data.avatar_url
    };
  } catch (error) {
    throw new Error("User not found");
  }
};

module.exports = { fetchGitHubProfile };