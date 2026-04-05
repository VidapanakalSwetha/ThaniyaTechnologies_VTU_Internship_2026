import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Report() {
  const { username } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/${username}`
        );
        const result = await res.json();

        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [username]);

  const getColor = (val) => {
    if (val >= 80) return "#22c55e";
    if (val >= 50) return "#facc15";
    return "#ef4444";
  };

  // 🔥 LOADER UI
  if (loading) {
    return (
      <div className="center">
        <div className="loader"></div>
        <p>Analyzing developer...</p>
      </div>
    );
  }

  // 🔥 ERROR UI
  if (!data || !data.success) {
    return (
      <div className="center">
        <div className="error-card">
          <h2>❌ User Not Found</h2>
          <p>Please check the username and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      {/* LEFT */}
      <div className="card-left">
        <img src={data.data.avatar} className="avatar" />

        <h2>{data.data.name}</h2>
        <p className="bio">{data.data.bio}</p>

        <div className="score-box">
          <h1>{data.data.scores.overall}</h1>
          <p>{data.data.level}</p>
        </div>

        <h3 className="badge">
          {data.data.scores.overall >= 80
            ? "🔥 Highly Hireable"
            : data.data.scores.overall >= 60
            ? "👍 Hireable"
            : "⚠️ Needs Improvement"}
        </h3>
      </div>

      {/* RIGHT */}
      <div className="card-right">
        <h3>📊 Score Breakdown</h3>

        {[
          { label: "Activity", value: data.data.scores.activity },
          { label: "Code Quality", value: data.data.scores.codeQuality },
          { label: "Diversity", value: data.data.scores.diversity },
          { label: "Community", value: data.data.scores.community },
        ].map((item, index) => (
          <div key={index} className="progress-item">
            <div className="progress-head">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${item.value}%`,
                  background: getColor(item.value),
                }}
              />
            </div>
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>🔥 Top Projects</h3>

        {data.data.topRepos.map((repo, i) => (
          <a
            key={i}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-card"
          >
            <h4>{repo.name}</h4>
            <p>{repo.language || "Unknown"}</p>
            <p>⭐ {repo.stars} | 🍴 {repo.forks}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Report;