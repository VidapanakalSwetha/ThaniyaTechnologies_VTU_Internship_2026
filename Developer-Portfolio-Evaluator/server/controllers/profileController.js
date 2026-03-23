const { fetchGitHubProfile } = require("../services/githubService");

const getProfile = async (req, res) => {
  const username = req.params.username;

  try {
    const data = await fetchGitHubProfile(username);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getProfile };