// 🔹 Activity Score (based on number of repos)
const calculateActivityScore = (publicRepos) => {
  if (publicRepos > 50) return 90;
  if (publicRepos > 20) return 70;
  if (publicRepos > 10) return 50;
  return 30;
};

// 🔹 Code Quality Score (based on repos with description)
const calculateCodeQualityScore = (repos) => {
  const goodRepos = repos.filter((repo) => repo.language !== null);
  return Math.min(goodRepos.length * 5, 100);
};

// 🔹 Diversity Score (based on languages used)
const calculateDiversityScore = (repos) => {
  const languages = new Set(repos.map((repo) => repo.language));
  return Math.min(languages.size * 15, 100);
};

// 🔹 Community Score (based on stars + followers)
const calculateCommunityScore = (followers, repos) => {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
  return Math.min((followers * 2 + totalStars) / 2, 100);
};

// 🔹 Overall Score
const calculateOverallScore = (scores) => {
  const { activity, codeQuality, diversity, community } = scores;
  return Math.round(
    (activity + codeQuality + diversity + community) / 4
  );
};

module.exports = {
  calculateActivityScore,
  calculateCodeQualityScore,
  calculateDiversityScore,
  calculateCommunityScore,
  calculateOverallScore,
};