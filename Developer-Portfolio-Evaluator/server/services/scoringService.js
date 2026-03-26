
const calculateActivityScore = (publicRepos, repos) => {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);

  if (publicRepos > 50 || totalStars > 500) return 90;
  if (publicRepos > 20 || totalStars > 200) return 70;
  if (publicRepos > 10 || totalStars > 50) return 50;

  return 30;
};


const calculateCodeQualityScore = (repos) => {
  const goodRepos = repos.filter(
    (repo) => repo.language !== null && repo.stars > 0
  );

  return Math.min(goodRepos.length * 7, 100);
};

const calculateDiversityScore = (repos) => {
  const languages = new Set(
    repos
      .map((repo) => repo.language)
      .filter((lang) => lang !== null)
  );

  return Math.min(languages.size * 15, 100);
};


const calculateCommunityScore = (followers, repos) => {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);

  const score = followers * 0.5 + totalStars * 0.05;

  return Math.min(Math.round(score), 100);
};


const calculateOverallScore = (scores) => {
  const { activity, codeQuality, diversity, community } = scores;

  return Math.round(
    (activity + codeQuality + diversity + community) / 4
  );
};


const getDeveloperLevel = (overall) => {
  if (overall >= 80) return "Expert";
  if (overall >= 60) return "Intermediate";
  return "Beginner";
};

module.exports = {
  calculateActivityScore,
  calculateCodeQualityScore,
  calculateDiversityScore,
  calculateCommunityScore,
  calculateOverallScore,
  getDeveloperLevel,
};