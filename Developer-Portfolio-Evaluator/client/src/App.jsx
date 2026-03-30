import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/profile/${username}`
      );
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // 🔥 Hiring Status
  const getHiringStatus = (score) => {
    if (score >= 80) return "🔥 Highly Hireable";
    if (score >= 60) return "👍 Hireable";
    return "⚠️ Needs Improvement";
  };

  // 🔥 Color logic
  const getColor = (val) => {
    if (val >= 80) return "#22c55e"; // green
    if (val >= 50) return "#facc15"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div>
      <h1>🚀 Developer Portfolio Evaluator</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button onClick={handleSearch}>Analyze</button>
      </div>

      {/* 🔥 Loader */}
      {loading && <p>⏳ Analyzing developer...</p>}

      {data && data.success && (
        <>
          {/* Profile Card */}
          <div className="card">
            <img src={data.data.avatar} className="avatar" />

            <h2>{data.data.name}</h2>
            <p>{data.data.bio}</p>

            <h3>🏆 {data.data.level}</h3>
            <h3>{getHiringStatus(data.data.scores.overall)}</h3>

            <h2>⭐ {data.data.scores.overall}</h2>
          </div>

          {/* Scores */}
          <div className="scores">
            <h3>📊 Score Breakdown</h3>

            {[
              { label: "Activity", value: data.data.scores.activity },
              { label: "Code Quality", value: data.data.scores.codeQuality },
              { label: "Diversity", value: data.data.scores.diversity },
              { label: "Community", value: data.data.scores.community },
            ].map((item, index) => (
              <div key={index} style={{ margin: "12px 0" }}>
                <p>
                  {item.label}: {item.value}
                </p>

                <div
                  style={{
                    background: "#333",
                    borderRadius: "10px",
                    height: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.value}%`,
                      background: getColor(item.value),
                      height: "100%",
                      transition: "0.5s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Top Repositories */}
          <div>
            <h3>🔥 Top Projects</h3>

            {data.data.topRepos.map((repo, index) => (
              <div key={index} className="repo-card">
                <h4>{repo.name}</h4>
                <p>
                  ⭐ {repo.stars} | 🍴 {repo.forks}
                </p>
                <p>🧠 {repo.language || "Unknown"}</p>

                <a href={repo.url} target="_blank">
                  View Repo →
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {data && !data.success && (
        <p style={{ color: "red" }}>{data.message}</p>
      )}
    </div>
  );
}

export default App;