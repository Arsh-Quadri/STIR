const express = require("express");
const cors = require("cors");
const { fetchTrendingTopics } = require("./seleniumScript");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/run-script", async (req, res) => {
  try {
    const data = await fetchTrendingTopics();
    res.json(data);
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    res.status(500).send("Something went wrong.");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
