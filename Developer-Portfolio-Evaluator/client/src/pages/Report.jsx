import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Radar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

function Report() {
  const { username } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [username]);

  // 🔥 Chart Data
  const chartData = {
    labels: ["Activity", "Code", "Diversity", "Community"],
    datasets: [
      {
        label: "Score",
        data: [
          data?.data?.scores?.activity || 0,
          data?.data?.scores?.codeQuality || 0,
          data?.data?.scores?.diversity || 0,
          data?.data?.scores?.community || 0,
        ],
        backgroundColor: "rgba(34,197,94,0.2)",
        borderColor: "#22c55e",
        borderWidth: 2,
      },
    ],
  };

  if (loading) return <p>⏳ Loading...</p>;

  if (!data || !data.success) {
    return <p style={{ color: "red" }}>User not found</p>;
  }

  return (
    <div className="main">
      {/* LEFT CARD */}
      <div className="card-left">
        <img src={data.data.avatar} className="avatar" />

        <h2>{data.data.name}</h2>
        <p className="bio">{data.data.bio}</p>

        <div className="score-box">
          <h1>{data.data.scores.overall}</h1>
          <p>{data.data.level}</p>
        </div>

        {/* 🔥 Hireability */}
        <h3 className="badge">
          {data.data.scores.overall >= 80
            ? "🔥 Highly Hireable"
            : data.data.scores.overall >= 60
            ? "👍 Hireable"
            : "⚠️ Needs Improvement"}
        </h3>
      </div>

      {/* RIGHT SIDE */}
      <div className="card-right">
        <h3>📊 Performance Chart</h3>
        <Radar data={chartData} />

        <h3 style={{ marginTop: "20px" }}>Score Breakdown</h3>

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
                style={{ width: `${item.value}%` }}
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
            style={{
              textDecoration: "none",
              color: "white",
              display: "block",
            }}
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