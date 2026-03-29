import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/profile/${username}`
      );
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h1>🚀 Developer Portfolio Evaluator</h1>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginRight: "10px",
        }}
      />

      <button onClick={handleSearch} style={{ padding: "10px" }}>
        Analyze
      </button>

      {data && data.success && (
        <div style={{ marginTop: "30px" }}>
          
          {/* Profile Card */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              display: "inline-block",
              width: "300px",
            }}
          >
            <img
              src={data.data.avatar}
              width="100"
              style={{ borderRadius: "50%" }}
            />
            <h2>{data.data.name}</h2>
            <p>{data.data.bio}</p>

            <h3>🏆 {data.data.level}</h3>
            <h2>⭐ {data.data.scores.overall}</h2>
          </div>

          {/* Scores Section */}
          <div style={{ marginTop: "20px" }}>
            <h3>📊 Score Breakdown</h3>
            <p>Activity: {data.data.scores.activity}</p>
            <p>Code Quality: {data.data.scores.codeQuality}</p>
            <p>Diversity: {data.data.scores.diversity}</p>
            <p>Community: {data.data.scores.community}</p>
          </div>

          {/* Top Repos */}
          <div style={{ marginTop: "20px" }}>
            <h3>🔥 Top Projects</h3>

            {data.data.topRepos.map((repo, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <h4>{repo.name}</h4>
                <p>⭐ {repo.stars} | 🍴 {repo.forks}</p>
                <p>🧠 {repo.language || "Unknown"}</p>

                <a href={repo.url} target="_blank">
                  View Repo
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {data && !data.success && (
        <p style={{ color: "red" }}>{data.message}</p>
      )}
    </div>
  );
}

export default App;