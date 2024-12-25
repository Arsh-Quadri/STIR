import { useState } from "react";

function Trending() {
  const [trendingData, setTrendingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTrendingTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/run-script", {
        method: "POST",
      });
      const data = await response.json();
      setTrendingData(data);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button onClick={fetchTrendingTopics} disabled={loading}>
        {loading ? "Fetching..." : "Click here to run the script"}
      </button>

      {trendingData && (
        <div>
          <h3>
            These are the most happening topics as on {trendingData.timestamp}
          </h3>
          <ul>
            <li>{trendingData.trend1}</li>
            <li>{trendingData.trend2}</li>
            <li>{trendingData.trend3}</li>
            <li>{trendingData.trend4}</li>
            <li>{trendingData.trend5}</li>
          </ul>
          <p>The IP address used for this query was {trendingData.ipAddress}</p>
          <pre>{JSON.stringify(trendingData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Trending;
