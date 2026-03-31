const axios = require("axios");

const {
  calculateActivityScore,
  calculateCodeQualityScore,
  calculateDiversityScore,
  calculateCommunityScore,
  calculateOverallScore,
  getDeveloperLevel,
} = require("./scoringService");

// 🔥 Common headers (important for GitHub API)
const axiosConfig = {
  headers: {
    "User-Agent": "portfolio-evaluator-app",
    Accept: "application/vnd.github.v3+json",
  },
  timeout: 10000, // 10 seconds timeout
};

// 🔹 Fetch Repositories
const fetchUserRepos = async (username) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      axiosConfig
    );

    return response.data.map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
    }));
  } catch (error) {
    console.error("Repo Fetch Error:", error.message);

    if (error.response?.status === 404) {
      throw new Error("Repositories not found");
    }

    if (error.response?.status === 403) {
      throw new Error("GitHub API rate limit exceeded");
    }

    throw new Error("Error fetching repositories");
  }
};

// 🔹 Get Top 5 Repos
const getTopRepositories = (repos) => {
  return repos
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5);
};

// 🔹 Fetch GitHub Profile
const fetchGitHubProfile = async (username) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      axiosConfig
    );

    const repos = await fetchUserRepos(username);
    const topRepos = getTopRepositories(repos);

    // 🔹 Scores
    const activity = calculateActivityScore(
      response.data.public_repos,
      repos
    );

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

    const level = getDeveloperLevel(overall);

    return {
      username: response.data.login,
      name: response.data.name,
      bio: response.data.bio,
      followers: response.data.followers,
      publicRepos: response.data.public_repos,
      avatar: response.data.avatar_url,

      topRepos,

      scores: {
        activity,
        codeQuality,
        diversity,
        community,
        overall,
      },

      level,
    };
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);

    if (error.response?.status === 404) {
      throw new Error("GitHub user not found");
    }

    if (error.response?.status === 403) {
      throw new Error("GitHub API rate limit exceeded");
    }

    throw new Error("Something went wrong while fetching data");
  }
};

module.exports = { fetchGitHubProfile };