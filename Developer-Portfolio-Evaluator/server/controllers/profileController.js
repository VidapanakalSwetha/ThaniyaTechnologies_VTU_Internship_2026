const getProfile = (req, res) => {
  const username = req.params.username;

  res.json({
    message: `Fetching data for ${username}`
  });
};

module.exports = { getProfile };