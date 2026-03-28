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
    <div style={{ padding: "20px" }}>
      <h1>Developer Portfolio Evaluator</h1>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {data && (
        <div>
          <h2>{data.data.name}</h2>
          <p>{data.data.bio}</p>
          <img src={data.data.avatar} width="100" />

          <h3>Overall Score: {data.data.scores.overall}</h3>
          <h3>Level: {data.data.level}</h3>
        </div>
      )}
    </div>
  );
}

export default App;