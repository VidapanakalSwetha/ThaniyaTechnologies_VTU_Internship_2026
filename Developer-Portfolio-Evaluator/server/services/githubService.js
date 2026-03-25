const axios = require("axios");

const {
  calculateActivityScore,
  calculateCodeQualityScore,
  calculateDiversityScore,
  calculateCommunityScore,
  calculateOverallScore,
} = require("./scoringService");


const fetchUserRepos = async (username) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );

    return response.data.map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
    }));
  } catch (error) {
    throw new Error("Error fetching repositories");
  }
};


const getTopRepositories = (repos) => {
  return repos
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5);
};

const fetchGitHubProfile = async (username) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const repos = await fetchUserRepos(username);
    const topRepos = getTopRepositories(repos);

    const activity = calculateActivityScore(response.data.public_repos);
    const codeQuality = calculateCodeQualityScore(repos);
    const diversity = calculateDiversityScore(repos);
    const community = calculateCommunityScore(
      response.data.followers,
      repos
    );

    const overall = calculateOverallScore({
      activity,
      codeQuality,
      diversity,
      community,
    });

    return {
      username: response.data.login,
      name: response.data.name,
      bio: response.data.bio,
      followers: response.data.followers,
      publicRepos: response.data.public_repos,
      avatar: response.data.avatar_url,

      topRepos: topRepos,


      scores: {
        activity,
        codeQuality,
        diversity,
        community,
        overall,
      },
    };
  } catch (error) {
    throw new Error("User not found");
  }
};

module.exports = { fetchGitHubProfile };