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
    </div>
  );
}

export default Home;