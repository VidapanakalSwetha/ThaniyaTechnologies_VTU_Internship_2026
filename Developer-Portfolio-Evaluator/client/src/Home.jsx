import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!username) return;
    navigate(`/report/${username}`);
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <h1>🚀 Developer Portfolio Evaluator</h1>

      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "12px",
            width: "250px",
            borderRadius: "8px",
            border: "none",
            marginRight: "10px",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#22c55e",
            color: "white",
            cursor: "pointer",
          }}
        >
          Analyze →
        </button>
      </div>
    </div>
  );
}

export default Home;